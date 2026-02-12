import { Module } from '@nestjs/common';
import { SortResolverService } from './sort-resolver.service';
import { CoreSortHandler } from './handlers/core-sort.handler';
import { CustomFieldIntSortHandler } from './handlers/custom-field-int-sort.handler';
import { CustomFieldDecimalSortHandler } from './handlers/custom-field-decimal-sort.handler';
import { CustomFieldStringSortHandler } from './handlers/custom-field-string-sort.handler';
import { CustomFieldDateSortHandler } from './handlers/custom-field-date-sort.handler';

@Module({
  providers: [
    CoreSortHandler,
    CustomFieldIntSortHandler,
    CustomFieldDecimalSortHandler,
    CustomFieldStringSortHandler,
    CustomFieldDateSortHandler,
    {
      provide: SortResolverService,
      useFactory: (
        a: CoreSortHandler,
        i: CustomFieldIntSortHandler,
        d: CustomFieldDecimalSortHandler,
        s: CustomFieldStringSortHandler,
        dt: CustomFieldDateSortHandler,
      ) => new SortResolverService([a, i, d, s, dt]),
      inject: [CoreSortHandler, CustomFieldIntSortHandler, CustomFieldDecimalSortHandler, CustomFieldStringSortHandler, CustomFieldDateSortHandler],
    },
  ],
  exports: [SortResolverService],
})
export class SortsModule {}
