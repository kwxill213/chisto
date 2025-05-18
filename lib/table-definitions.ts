import { ColumnDef } from '@tanstack/react-table';

export interface TableDefinition {
  value: string;
  label: string;
  columns: ColumnDef<any>[];
  editable: boolean;
}

export const getTableDefinitions = (): TableDefinition[] => [
  {
    value: 'userRoles',
    label: 'Роли пользователей',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Название' },
      { accessorKey: 'description', header: 'Описание' },
    ],
  },
  {
    value: 'usersTable',
    label: 'Пользователи',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'email', header: 'Email' },
      { accessorKey: 'name', header: 'Имя' },
      { accessorKey: 'phone', header: 'Телефон' },
      { accessorKey: 'roleId', header: 'Роль' },
      { accessorKey: 'createdAt', header: 'Дата регистрации' },
    ],
  },
  {
    value: 'employeeStatuses',
    label: 'Статусы работников',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Название' },
      { accessorKey: 'description', header: 'Описание' },
    ],
  },
  {
    value: 'employeeProfiles',
    label: 'Профили работников',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'userId', header: 'Пользователь' },
      { accessorKey: 'hireDate', header: 'Дата найма' },
      { accessorKey: 'salary', header: 'Зарплата' },
      { accessorKey: 'rating', header: 'Рейтинг' },
      { accessorKey: 'completedOrders', header: 'Завершенные заказы' },
      { accessorKey: 'statusId', header: 'Статус' },
    ],
  },
  {
    value: 'propertyTypes',
    label: 'Типы недвижимости',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Название' },
      { accessorKey: 'description', header: 'Описание' },
    ],
  },
  {
    value: 'orderStatuses',
    label: 'Статусы заказов',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Название' },
      { accessorKey: 'description', header: 'Описание' },
    ],
  },
  {
    value: 'paymentStatuses',
    label: 'Статусы оплаты',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Название' },
      { accessorKey: 'description', header: 'Описание' },
    ],
  },
  {
    value: 'paymentMethods',
    label: 'Методы оплаты',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Название' },
      { accessorKey: 'description', header: 'Описание' },
    ],
  },
  {
    value: 'serviceCategories',
    label: 'Категории услуг',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Название' },
      { accessorKey: 'description', header: 'Описание' },
    ],
  },
  {
    value: 'services',
    label: 'Услуги',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Название' },
      { accessorKey: 'description', header: 'Описание' },
      { accessorKey: 'pricePerSquare', header: 'Цена за м²' },
      { accessorKey: 'basePrice', header: 'Базовая цена' },
      { accessorKey: 'categoryId', header: 'Категория' },
      { accessorKey: 'duration', header: 'Длительность (мин)' },
      { accessorKey: 'isActive', header: 'Активна' },
      { accessorKey: 'image_url', header: 'Изображение' },
    ],
  },
  {
    value: 'orders',
    label: 'Заказы',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'userId', header: 'Клиент' },
      { accessorKey: 'employeeId', header: 'Работник' },
      { accessorKey: 'serviceId', header: 'Услуга' },
      { accessorKey: 'propertyTypeId', header: 'Тип недвижимости' },
      { accessorKey: 'address', header: 'Адрес' },
      { accessorKey: 'square', header: 'Площадь (м²)' },
      { accessorKey: 'totalPrice', header: 'Общая стоимость' },
      { accessorKey: 'date', header: 'Дата' },
      { accessorKey: 'statusId', header: 'Статус' },
      { accessorKey: 'paymentStatusId', header: 'Статус оплаты' },
      { accessorKey: 'createdAt', header: 'Дата создания' },
    ],
  },
  // {
  //   value: 'reviews',
  //   label: 'Отзывы',
  //   editable: false,
  //   columns: [
  //     { accessorKey: 'id', header: 'ID' },
  //     { accessorKey: 'orderId', header: 'Заказ' },
  //     { accessorKey: 'userId', header: 'Пользователь' },
  //     { accessorKey: 'employeeId', header: 'Работник' },
  //     { accessorKey: 'rating', header: 'Оценка' },
  //     { accessorKey: 'comment', header: 'Комментарий' },
  //     { accessorKey: 'createdAt', header: 'Дата' },
  //   ],
  // },
  {
    value: 'ticketStatuses',
    label: 'Статусы тикетов',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Название' },
      { accessorKey: 'description', header: 'Описание' },
    ],
  },
  {
    value: 'supportTickets',
    label: 'Тикеты поддержки',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'userId', header: 'Пользователь' },
      { accessorKey: 'subject', header: 'Тема' },
      { accessorKey: 'statusId', header: 'Статус' },
      { accessorKey: 'createdAt', header: 'Дата создания' },
      { accessorKey: 'updatedAt', header: 'Дата обновления' },
    ],
  },
  {
    value: 'supportMessages',
    label: 'Сообщения поддержки',
    editable: false,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'ticketId', header: 'Тикет' },
      { accessorKey: 'senderId', header: 'Отправитель' },
      { accessorKey: 'message', header: 'Сообщение' },
      { accessorKey: 'isRead', header: 'Прочитано' },
      { accessorKey: 'createdAt', header: 'Дата' },
    ],
  },
  {
    value: 'notificationTypes',
    label: 'Типы уведомлений',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'name', header: 'Название' },
      { accessorKey: 'description', header: 'Описание' },
    ],
  },
  {
    value: 'notifications',
    label: 'Уведомления',
    editable: false,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'userId', header: 'Пользователь' },
      { accessorKey: 'title', header: 'Заголовок' },
      { accessorKey: 'message', header: 'Сообщение' },
      { accessorKey: 'isRead', header: 'Прочитано' },
      { accessorKey: 'typeId', header: 'Тип' },
      { accessorKey: 'createdAt', header: 'Дата' },
    ],
  },
  {
    value: 'employeeSchedules',
    label: 'Расписания работников',
    editable: true,
    columns: [
      { accessorKey: 'id', header: 'ID' },
      { accessorKey: 'employeeId', header: 'Работник' },
      { accessorKey: 'date', header: 'Дата' },
      { accessorKey: 'startTime', header: 'Начало' },
      { accessorKey: 'endTime', header: 'Конец' },
      { accessorKey: 'isAvailable', header: 'Доступен' },
    ],
  },
  // {
  //   value: 'reportTypes',
  //   label: 'Типы отчетов',
  //   editable: true,
  //   columns: [
  //     { accessorKey: 'id', header: 'ID' },
  //     { accessorKey: 'name', header: 'Название' },
  //     { accessorKey: 'description', header: 'Описание' },
  //   ],
  // },
  // {
  //   value: 'reports',
  //   label: 'Отчеты',
  //   editable: false,
  //   columns: [
  //     { accessorKey: 'id', header: 'ID' },
  //     { accessorKey: 'typeId', header: 'Тип отчета' },
  //     { accessorKey: 'periodStart', header: 'Начало периода' },
  //     { accessorKey: 'periodEnd', header: 'Конец периода' },
  //     { accessorKey: 'createdAt', header: 'Дата создания' },
  //     { accessorKey: 'createdBy', header: 'Автор' },
  //   ],
  // },
];