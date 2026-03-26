"""Celery background tasks for document processing."""

from __future__ import annotations

import asyncio

from app.worker.celery_app import celery_app


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def process_document_task(self, document_id: str):
    """
    Background task: process a document (extract, chunk, embed, store).
    Falls back to synchronous execution if called directly.
    """
    from app.database import async_session
    from app.services.document_processor import process_document_sync

    async def _run():
        async with async_session() as session:
            try:
                await process_document_sync(document_id, session)
                await session.commit()
            except Exception as e:
                await session.rollback()
                raise e

    try:
        loop = asyncio.get_event_loop()
        if loop.is_running():
            # If we're already in an async context, create a new one
            import concurrent.futures
            with concurrent.futures.ThreadPoolExecutor() as pool:
                pool.submit(asyncio.run, _run()).result()
        else:
            asyncio.run(_run())
    except Exception as exc:
        raise self.retry(exc=exc)
