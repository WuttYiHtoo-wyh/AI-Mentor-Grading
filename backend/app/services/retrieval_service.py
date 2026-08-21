from typing import Any, Dict, List, Optional

from app.services.embedding_service import EmbeddingService
from app.services.vector_store_service import get_chroma_client

COLLECTION_NAME = "cpl_documents"
DEFAULT_TOP_K = 5
MAX_CHROMA_DISTANCE = 1.4
ALLOWED_MODES = {
    'explain_assignment',
    'explain_rubric',
    'explain_topic',
    'review_draft',
    'ask_anything',
}
MODE_FILTERS = {
    'explain_assignment': {'document_type': 'Assignment Brief'},
    'explain_rubric': {'document_type': 'Rubric'},
    'explain_topic': {'document_type': 'Learning Material'},
    'review_draft': None,
    'ask_anything': None,
}
REVIEW_DRAFT_ALLOWED = ['Rubric', 'Assignment Brief', 'Learning Material']
REVIEW_DRAFT_ASSIGNMENT_BRIEF_QUERY = (
    'CPL assignment requirements, required tasks, deliverables, objectives and submission expectations. '
    '{review_focus}'
)
REVIEW_DRAFT_RUBRIC_QUERY = (
    'CPL assessment criteria, rubric expectations, quality requirements and evidence expected from the learner. '
    '{review_focus}'
)
REVIEW_DRAFT_LEARNING_MATERIAL_QUERY = (
    'Relevant CPL concepts and learning material that can help the learner improve this work. '
    '{review_focus}'
)


def build_where_filter(course_id: str, mode: str) -> Dict[str, Any]:
    base_clause = {'course_id': course_id}

    if mode == 'review_draft':
        or_clauses = [{'document_type': doc_type} for doc_type in REVIEW_DRAFT_ALLOWED]
        return {'$and': [base_clause, {'$or': or_clauses}]}

    mode_filter = MODE_FILTERS.get(mode)
    if mode_filter:
        return {'$and': [base_clause, mode_filter]}

    return base_clause


def format_retrieval_item(document: str, metadata: Dict[str, Any], distance: float) -> Dict[str, Any]:
    return {
        'chunk_id': metadata.get('chunk_id') or metadata.get('id') or '',
        'title': metadata.get('title') or metadata.get('heading') or 'Unknown',
        'content': document,
        'document_type': metadata.get('document_type') or 'Unknown',
        'instructional_unit': metadata.get('instructional_unit'),
        'source_file': metadata.get('source_file') or metadata.get('source'),
        'distance': distance,
        'metadata': metadata,
    }


def format_thresholded_results(
    documents: List[str],
    metadatas: List[Dict[str, Any]],
    distances: List[float],
    mentor_mode: str,
) -> List[Dict[str, Any]]:
    items: List[Dict[str, Any]] = []
    for document, metadata, distance in zip(documents, metadatas, distances):
        if distance > MAX_CHROMA_DISTANCE:
            continue
        if mentor_mode == 'review_draft' and metadata.get('document_type') not in REVIEW_DRAFT_ALLOWED:
            continue
        items.append(format_retrieval_item(document, metadata, distance))
    return items


def retrieve_by_document_type(
    query: str,
    course_id: str,
    document_type: str,
    top_k: int,
) -> List[Dict[str, Any]]:
    if top_k <= 0:
        raise ValueError('top_k must be greater than zero')

    embedding_service = EmbeddingService()
    query_embedding = embedding_service.create_embeddings([query])[0]

    client = get_chroma_client()
    available_collections = [collection.name for collection in client.list_collections()]
    if COLLECTION_NAME not in available_collections:
        raise RuntimeError(f'Missing ChromaDB collection: {COLLECTION_NAME}')

    collection = client.get_collection(COLLECTION_NAME)
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where={'$and': [{'course_id': course_id}, {'document_type': document_type}]},
        include=['documents', 'metadatas', 'distances'],
    )

    documents = results.get('documents', [[]])[0]
    metadatas = results.get('metadatas', [[]])[0]
    distances = results.get('distances', [[]])[0]

    return format_thresholded_results(documents, metadatas, distances, 'review_draft')


def retrieve_review_draft_context(
    message: str,
    course_id: str,
    assessment_question: Optional[str] = None,
) -> List[Dict[str, Any]]:
    if assessment_question and assessment_question.strip():
        review_focus = f"Assessment question: {assessment_question.strip()} Learner request: {message}"
    else:
        review_focus = f"Learner request: {message}"

    retrieval_plan = [
        (
            'Assignment Brief',
            REVIEW_DRAFT_ASSIGNMENT_BRIEF_QUERY.format(review_focus=review_focus),
            2,
        ),
        (
            'Rubric',
            REVIEW_DRAFT_RUBRIC_QUERY.format(review_focus=review_focus),
            2,
        ),
        (
            'Learning Material',
            REVIEW_DRAFT_LEARNING_MATERIAL_QUERY.format(review_focus=review_focus),
            3,
        ),
    ]

    combined: List[Dict[str, Any]] = []
    seen_chunk_ids = set()

    for document_type, query, top_k in retrieval_plan:
        items = retrieve_by_document_type(
            query=query,
            course_id=course_id,
            document_type=document_type,
            top_k=top_k,
        )
        for item in items:
            chunk_id = item.get('chunk_id') or ''
            dedupe_key = chunk_id or f"{item.get('document_type')}::{item.get('title')}::{item.get('source_file')}"
            if dedupe_key in seen_chunk_ids:
                continue
            seen_chunk_ids.add(dedupe_key)
            combined.append(item)

    return combined


def retrieve_cpl_context(
    query: str,
    course_id: str,
    mentor_mode: str,
    top_k: Optional[int] = None,
) -> List[Dict[str, Any]]:
    if mentor_mode not in ALLOWED_MODES:
        raise ValueError(f'Unsupported mentor mode: {mentor_mode}')

    top_k = top_k or DEFAULT_TOP_K
    if top_k <= 0:
        raise ValueError('top_k must be greater than zero')

    embedding_service = EmbeddingService()
    query_embedding = embedding_service.create_embeddings([query])[0]

    client = get_chroma_client()
    available_collections = [collection.name for collection in client.list_collections()]
    if COLLECTION_NAME not in available_collections:
        raise RuntimeError(f'Missing ChromaDB collection: {COLLECTION_NAME}')

    collection = client.get_collection(COLLECTION_NAME)
    where = build_where_filter(course_id, mentor_mode)

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where=where,
        include=['documents', 'metadatas', 'distances'],
    )

    documents = results.get('documents', [[]])[0]
    metadatas = results.get('metadatas', [[]])[0]
    distances = results.get('distances', [[]])[0]

    items = format_thresholded_results(documents, metadatas, distances, mentor_mode)

    if not items and mentor_mode != 'ask_anything':
        fallback_results = collection.query(
            query_embeddings=[query_embedding],
            n_results=top_k,
            where=where,
            include=['documents', 'metadatas', 'distances'],
        )
        documents = fallback_results.get('documents', [[]])[0]
        metadatas = fallback_results.get('metadatas', [[]])[0]
        distances = fallback_results.get('distances', [[]])[0]
        items = format_thresholded_results(documents, metadatas, distances, mentor_mode)

    return items
