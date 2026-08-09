from pathlib import Path
from typing import Dict, List

import chromadb
from chromadb.config import Settings


def get_chroma_client() -> chromadb.Client:
    try:
        db_path = Path(__file__).resolve().parents[1] / 'chroma_db'
        db_path.mkdir(parents=True, exist_ok=True)
        return chromadb.Client(Settings(persist_directory=str(db_path), is_persistent=True))
    except Exception as exc:
        raise RuntimeError(f'ChromaDB initialization failed: {exc}')


def create_collection(client: chromadb.Client, name: str):
    try:
        if name in [collection.name for collection in client.list_collections()]:
            return client.get_collection(name)
        return client.create_collection(name)
    except Exception as exc:
        raise RuntimeError(f'Failed to create or get collection {name}: {exc}')


def store_embeddings(
    collection: chromadb.api.models.Collection,
    ids: List[str],
    embeddings: List[List[float]],
    metadatas: List[Dict],
    documents: List[str],
):
    try:
        collection.add(
            ids=ids,
            embeddings=embeddings,
            metadatas=metadatas,
            documents=documents,
        )
    except Exception as exc:
        raise RuntimeError(f'ChromaDB storage failed: {exc}')
