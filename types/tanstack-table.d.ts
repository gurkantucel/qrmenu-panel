import '@tanstack/table-core';

declare module '@tanstack/table-core' {
  interface ColumnMeta<TData = unknown, TValue = unknown> {
    filterVariant?: 
      | 'text'
      | 'range'
      | 'select'
      | 'select2'
      | 'date'
      | 'number'
      | 'orderStatus'
      | 'appointmentStatus'
      | 'appointmentType'
      | 'personNameSurname'
      | 'gender'
      | 'movementType';
  }
}