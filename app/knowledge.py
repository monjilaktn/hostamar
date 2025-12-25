# app/knowledge.py (Fail-Safe Version)
import os
from dotenv import load_dotenv

load_dotenv()

# Ultra-safe import strategy
HAS_CHROMA = False
try:
    import chromadb
    from langchain_chroma import Chroma
    from langchain_openai import OpenAIEmbeddings
    HAS_CHROMA = True
except ImportError:
    try:
        # Try legacy import
        from langchain_community.vectorstores import Chroma
        from langchain_openai import OpenAIEmbeddings
        HAS_CHROMA = True
    except ImportError:
        pass # Chroma not available

KNOWLEDGE_DIR = "knowledge_base"
if not os.path.exists(KNOWLEDGE_DIR):
    os.makedirs(KNOWLEDGE_DIR)

class KnowledgeBase:
    def __init__(self):
        self.db = None
        if HAS_CHROMA:
            try:
                self.embeddings = OpenAIEmbeddings()
                self.db = Chroma(
                    persist_directory=KNOWLEDGE_DIR, 
                    embedding_function=self.embeddings,
                    collection_name="hostamar_docs"
                )
            except Exception as e:
                print(f"[WARNING] Knowledge Base Init Error: {e}")

    def add_texts(self, texts: list[str], metadata: list[dict] = None):
        if self.db:
            self.db.add_texts(texts, metadatas=metadata)

    def search(self, query: str, k=3):
        if not self.db:
            return "Knowledge Base is offline (ChromaDB missing)."
        try:
            results = self.db.similarity_search(query, k=k)
            return "\n\n".join([doc.page_content for doc in results])
        except Exception:
            return "Search failed."

knowledge_manager = KnowledgeBase()