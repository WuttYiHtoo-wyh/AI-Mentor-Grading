import os
import sys
from pathlib import Path
from typing import Dict, List, Optional

import openai
from openai.error import OpenAIError

from app.services.vector_store_service import get_chroma_client
from app.services.embedding_service import get_openai_api_key


DEFAULT_QUERIES = [
    "What is this assignment about?",
    "What are the assessment criteria?",
    "What documents are required?",
    "What are the stages of the Software Development Life Cycle?",
    "What are the weaknesses in the bad learner report?",
]
COLLECTION_NAME = "sdlc_documents"
COURSE_FILTER = {"course_id": "SDLC"}
MAX_RESULTS = 5
EMBEDDING_MODEL = "text-embedding-3-small"


def build_search_embedding(query: str) -> List[float]:
    api_key = get_openai_api_key()
    openai.api_key = api_key

    try:
        response = openai.Embedding.create(
            input=[query],
            model=EMBEDDING_MODEL,
        )
        return response.data[0].embedding
    except OpenAIError as exc:
        raise RuntimeError(f"Embedding generation failed: {exc}")
    except Exception as exc:
        raise RuntimeError(f"Failed to create embedding: {exc}")


def retrieve_from_collection(query_embedding: List[float]) -> Dict:
    client = get_chroma_client()
    collections = [collection.name for collection in client.list_collections()]
    if COLLECTION_NAME not in collections:
        raise RuntimeError(f"Missing ChromaDB collection: {COLLECTION_NAME}")

    collection = client.get_collection(COLLECTION_NAME)
    results = collection.query(
        query_embeddings=query_embedding,
        n_results=MAX_RESULTS,
        where=COURSE_FILTER,
        include=["documents", "metadatas", "distances"],
    )
    return results


def format_result(rank: int, document: str, metadata: Dict, distance: float) -> str:
    source_file = metadata.get("source_file", "unknown")
    document_type = metadata.get("document_type", "unknown")
    heading = metadata.get("heading", "")
    chunk_index = metadata.get("chunk_index", "?")

    return (
        f"Rank: {rank}\n"
        f"Score: {distance}\n"
        f"Source File: {source_file}\n"
        f"Document Type: {document_type}\n"
        f"Heading: {heading or '[none]'}\n"
        f"Chunk Index: {chunk_index}\n"
        f"Retrieved Text: {document}\n"
        "-" * 80
    )


def run_query(query: str) -> None:
    if not query or not query.strip():
        raise ValueError("Query must not be empty.")

    print(f"\nQuery: {query}")
    embedding = build_search_embedding(query)
    result_set = retrieve_from_collection(embedding)

    documents = result_set.get("documents", [])
    metadatas = result_set.get("metadatas", [])
    distances = result_set.get("distances", [])

    if not documents or not documents[0]:
        raise RuntimeError("No retrieval results returned.")

    documents = documents[0]
    metadatas = metadatas[0] if metadatas else []
    distances = distances[0] if distances else []

    if not documents:
        raise RuntimeError("No retrieval results returned.")

    for rank, (document, metadata, distance) in enumerate(
        zip(documents, metadatas, distances), start=1
    ):
        print(format_result(rank, document, metadata, distance))


def main():
    sys.path.insert(0, str(Path(__file__).resolve().parents[2]))
    query = None

    if len(sys.argv) > 1:
        query = " ".join(sys.argv[1:]).strip()

    queries = [query] if query else DEFAULT_QUERIES

    for item in queries:
        try:
            run_query(item)
        except Exception as exc:
            print(f"Error for query '{item}': {exc}")


if __name__ == "__main__":
    main()
