import os
import sys
import argparse
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from app.services.document_service import (
    chunk_text,
    determine_document_type,
    extract_docx_text,
)
from app.services.embedding_service import EmbeddingService
from app.services.vector_store_service import (
    create_collection,
    get_chroma_client,
    store_embeddings,
)


def ingest_documents(source_dir: Path, collection_name: str = 'sdlc_documents', course_id: str = 'SDLC'):
    print(f'Reading documents from {source_dir} for course {course_id}...')
    if not source_dir.exists():
        raise FileNotFoundError(f'Document folder not found: {source_dir}')

    docx_files = sorted(source_dir.glob('*.docx'))
    if not docx_files:
        raise FileNotFoundError(f'No .docx files found in {source_dir}')

    embedding_service = EmbeddingService()
    client = get_chroma_client()
    collection = create_collection(client, collection_name)

    total_documents = 0
    total_chunks = 0
    ids = []
    metadatas = []
    documents = []
    texts = []
    seen_ids = set()

    def unique_id(base_id: str) -> str:
        candidate = base_id
        suffix = 1
        while candidate in seen_ids:
            candidate = f'{base_id}-{suffix}'
            suffix += 1
        seen_ids.add(candidate)
        return candidate

    for filepath in docx_files:
        print(filepath.name)
        doc_type = determine_document_type(filepath.name)

        extracted_sections = extract_docx_text(filepath)
        if not extracted_sections:
            print(f'✗ No text extracted from {filepath.name}')
            continue

        chunk_count = 0
        for section_index, section in enumerate(extracted_sections):
            if section.get('chunk_id'):
                chunk_text_value = section.get('text') or section.get('content') or ''
                if not chunk_text_value:
                    continue
                chunk_id = section['chunk_id']
                chroma_id = unique_id(f'{filepath.stem}-{chunk_id}')
                metadata = {'course_id': course_id, 'source_file': filepath.name}
                metadata.update({
                    k: v
                    for k, v in section.items()
                    if k not in {'text', 'content', 'learning_objective', 'example', 'key_takeaways'}
                })
                if 'document_type' not in metadata:
                    metadata['document_type'] = doc_type
                ids.append(chroma_id)
                metadatas.append(metadata)
                documents.append(chunk_text_value)
                texts.append(chunk_text_value)
                chunk_count += 1
            else:
                heading = section.get('heading')
                text = section['text']
                chunks = chunk_text(text)
                chunk_count += len(chunks)
                for index, chunk in enumerate(chunks):
                    chunk_id = f'{filepath.stem}-{section_index+1}-{index+1}'
                    chroma_id = unique_id(chunk_id)
                    ids.append(chroma_id)
                    metadatas.append({
                        'course_id': course_id,
                        'document_type': doc_type,
                        'source_file': filepath.name,
                        'section_index': section_index + 1,
                        'chunk_index': index + 1,
                        'heading': heading or '',
                    })
                    documents.append(chunk)
                    texts.append(chunk)

        total_documents += 1
        total_chunks += chunk_count
        print('✓ Extracted')
        print(f'✓ {chunk_count} chunks')

    print('Embedding complete.')
    print('Storing embeddings...')

    embeddings = embedding_service.create_embeddings(texts)
    store_embeddings(collection, ids=ids, embeddings=embeddings, metadatas=metadatas, documents=documents)

    print('Stored successfully.')
    print(f'Total documents: {total_documents}')
    print(f'Total chunks: {total_chunks}')
    print(f'Collection name: {collection_name}')

    return total_documents, total_chunks, len(embeddings), collection_name


if __name__ == '__main__':
    root = Path(__file__).resolve().parents[2]
    parser = argparse.ArgumentParser(description='Ingest Word documents into ChromaDB collections.')
    parser.add_argument('--source-dir', type=Path, default=root / 'SDLC_Docs', help='Directory containing .docx files to ingest.')
    parser.add_argument('--collection', default='sdlc_documents', help='ChromaDB collection name.')
    parser.add_argument('--course-id', default='SDLC', help='Course ID to apply to ingested metadata.')
    args = parser.parse_args()

    source_dir = args.source_dir if args.source_dir.is_absolute() else root / args.source_dir
    ingest_documents(source_dir, args.collection, args.course_id)
