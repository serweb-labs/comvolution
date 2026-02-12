import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

export type ProductCreatedEvent = { productId: string };
export type SchemaReindexRequestedEvent = { schemaId: string };

@Injectable()
export class DomainEventsService {
  readonly productCreated$ = new Subject<ProductCreatedEvent>();
  readonly schemaReindexRequested$ = new Subject<SchemaReindexRequestedEvent>();

  emitProductCreated(productId: string) {
    this.productCreated$.next({ productId });
  }

  emitSchemaReindexRequested(schemaId: string) {
    this.schemaReindexRequested$.next({ schemaId });
  }
}
