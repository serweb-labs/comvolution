import { Module } from '@nestjs/common';
import { FilterResolverService } from './filter-resolver.service';
import { CorePriceRangeHandler } from './handlers/core-price-range.handler';
import { CoreStatusEqHandler } from './handlers/core-status-eq.handler';
import { CoreSkuInHandler } from './handlers/core-sku-in.handler';
import { CustomFieldStringEqualityHandler } from './handlers/custom-field-string-equality.handler';
import { CustomFieldBoolEqualityHandler } from './handlers/custom-field-bool-equality.handler';
import { CustomFieldIntEqualityHandler } from './handlers/custom-field-int-equality.handler';
import { CustomFieldDecimalEqualityHandler } from './handlers/custom-field-decimal-equality.handler';
import { CustomFieldDateEqualityHandler } from './handlers/custom-field-date-equality.handler';
import { CustomFieldIntRangeHandler } from './handlers/custom-field-int-range.handler';
import { CustomFieldDecimalRangeHandler } from './handlers/custom-field-decimal-range.handler';
import { CustomFieldDateRangeHandler } from './handlers/custom-field-date-range.handler';

@Module({
  providers: [
    CorePriceRangeHandler,
    CoreStatusEqHandler,
    CoreSkuInHandler,
    CustomFieldStringEqualityHandler,
    CustomFieldBoolEqualityHandler,
    CustomFieldIntEqualityHandler,
    CustomFieldDecimalEqualityHandler,
    CustomFieldDateEqualityHandler,
    CustomFieldIntRangeHandler,
    CustomFieldDecimalRangeHandler,
    CustomFieldDateRangeHandler,
    {
      provide: FilterResolverService,
      useFactory: (
        a: CorePriceRangeHandler,
        b: CoreStatusEqHandler,
        c: CoreSkuInHandler,
        sEq: CustomFieldStringEqualityHandler,
        bEq: CustomFieldBoolEqualityHandler,
        iEq: CustomFieldIntEqualityHandler,
        dEq: CustomFieldDecimalEqualityHandler,
        dtEq: CustomFieldDateEqualityHandler,
        iRg: CustomFieldIntRangeHandler,
        dRg: CustomFieldDecimalRangeHandler,
        dtRg: CustomFieldDateRangeHandler,
      ) => new FilterResolverService([a, b, c, sEq, bEq, iEq, dEq, dtEq, iRg, dRg, dtRg]),
      inject: [
        CorePriceRangeHandler,
        CoreStatusEqHandler,
        CoreSkuInHandler,
        CustomFieldStringEqualityHandler,
        CustomFieldBoolEqualityHandler,
        CustomFieldIntEqualityHandler,
        CustomFieldDecimalEqualityHandler,
        CustomFieldDateEqualityHandler,
        CustomFieldIntRangeHandler,
        CustomFieldDecimalRangeHandler,
        CustomFieldDateRangeHandler,
      ],
    },
  ],
  exports: [FilterResolverService],
})
export class FiltersModule {}
