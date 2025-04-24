/*==============================================================*/
/* DBMS name:      MySQL 5.0                                    */
/* Created on:     4/24/2025 08:15:54 PM                        */
/*==============================================================*/


drop table if exists BRAND;

drop table if exists CART;

drop table if exists CART_ITEM;

drop table if exists CATEGORY;

drop table if exists COMMENT;

drop table if exists "ORDER";

drop table if exists ORDER_ITEM;

drop table if exists PRODUCT;

drop table if exists PRODUCT_DETAILS;

drop table if exists PROMOTION;

drop table if exists ROLE;

drop table if exists SETTING;

drop table if exists USER;

/*==============================================================*/
/* Table: BRAND                                                 */
/*==============================================================*/
create table BRAND
(
   ID_BRAND             int not null,
   NAME                 varchar(255),
   DESCRIPTION          text,
   CREATEAT             datetime,
   UPDATEAT             datetime,
   ISDELETE             bool,
   primary key (ID_BRAND)
);

/*==============================================================*/
/* Table: CART                                                  */
/*==============================================================*/
create table CART
(
   ID_CART              int not null,
   ID_USER              int not null,
   CODENAME             varchar(255),
   DESCRIPTION          text,
   CREATEAT             datetime,
   UPDATEAT             datetime,
   ISDELETE             bool,
   primary key (ID_CART)
);

/*==============================================================*/
/* Table: CART_ITEM                                             */
/*==============================================================*/
create table CART_ITEM
(
   ID_CARTITEMS         int not null,
   ID_PRODUCTDETAILS    int not null,
   ID_CART              int not null,
   QUANTITY             int,
   TOTAL_PRICE          float,
   CREATEAT             datetime,
   UPDATEAT             datetime,
   ISDELETE             bool,
   primary key (ID_CARTITEMS)
);

/*==============================================================*/
/* Table: CATEGORY                                              */
/*==============================================================*/
create table CATEGORY
(
   ID_CATEGORY          int not null,
   NAME_CATEGORY        varchar(255),
   SLUG                 varchar(255),
   DESCRIPTION          text,
   PARENTID             int,
   CREATEAT             datetime,
   UPDATEAT             datetime,
   ISDELETE             bool,
   primary key (ID_CATEGORY)
);

/*==============================================================*/
/* Table: COMMENT                                               */
/*==============================================================*/
create table COMMENT
(
   ID_COMMENT           int not null,
   ID_PRODUCTDETAILS    int not null,
   ID_USER              int not null,
   CONTENT_COMMENT      text,
   STATUS               varchar(255),
   RATING               float,
   ISSHOW               bool,
   CREATEAT             datetime,
   UPDATEAT             datetime,
   ISDELETE             bool,
   primary key (ID_COMMENT)
);

/*==============================================================*/
/* Table: "ORDER"                                               */
/*==============================================================*/
create table "ORDER"
(
   ID_ORDER             int not null,
   ID_USER              int not null,
   QUANTITY             int,
   STATUS               varchar(255),
   PAYMENTSTATUS        varchar(255),
   PAYMENTMETHOD        varchar(255),
   TOTALORDERPRICE      float,
   DISCOUNTEDVOUCHERAMOUNT float,
   PRICEAFTERVOUCHER    float,
   CREATEAT             datetime,
   UPDATEAT             datetime,
   ISDELETE             bool,
   primary key (ID_ORDER)
);

/*==============================================================*/
/* Table: ORDER_ITEM                                            */
/*==============================================================*/
create table ORDER_ITEM
(
   ID_ORDERITEM         int not null,
   ID_PRODUCTDETAILS    int not null,
   ID_ORDER             int not null,
   QUANTITY             int,
   UNIT_PRICE           float,
   TOTAL_PRICE          float,
   CREATEAT             datetime,
   UPDATEAT             datetime,
   ISDELETE             bool,
   primary key (ID_ORDERITEM)
);

/*==============================================================*/
/* Table: PRODUCT                                               */
/*==============================================================*/
create table PRODUCT
(
   ID_PRODUCT           int not null,
   ID_PROMOTION         int not null,
   ID_CATEGORY          int not null,
   ID_BRAND             int not null,
   NAMEPRODUCT          varchar(255),
   SLUG                 varchar(255),
   STATUS               varchar(255),
   UNIT                 varchar(255),
   METATITLE            varchar(1000),
   SHORTDESCRIPTION     varchar(1000),
   DESCRIPTION          text,
   METADESCRIPTION      varchar(1000),
   ISDELETE             bool,
   CREATEAT             datetime,
   UPDATEAT             datetime,
   GALLERYPRODUCT       text,
   primary key (ID_PRODUCT)
);

/*==============================================================*/
/* Table: PRODUCT_DETAILS                                       */
/*==============================================================*/
create table PRODUCT_DETAILS
(
   ID_PRODUCTDETAILS    int not null,
   ID_PRODUCT           int not null,
   NAME_PRODUCTDETAILS  varchar(255),
   PRICE_PRODUCTDETAILS float,
   SALE_PRODUCTDETAILS  float,
   RATING_PRODUCTDETAILS float,
   ISSHOW_PRODUCTDETAILS bool,
   AMOUNT_AVAILABLE     int,
   SPECIFICATION        text,
   USERUPDATE           varchar(255),
   CREATEAT             datetime,
   UPDATEAT             datetime,
   ISDELETE             bool,
   primary key (ID_PRODUCTDETAILS)
);

/*==============================================================*/
/* Table: PROMOTION                                             */
/*==============================================================*/
create table PROMOTION
(
   ID_PROMOTION         int not null,
   NAME_PROMOTION       varchar(255),
   DISCOUNTRATE_PROMOTION float,
   DESCRIPTION          text,
   STRARDATE            datetime,
   ENDDATE              datetime,
   CREATEAT             datetime,
   UPDATEAT             datetime,
   ISDELETE             bool,
   primary key (ID_PROMOTION)
);

/*==============================================================*/
/* Table: ROLE                                                  */
/*==============================================================*/
create table ROLE
(
   ID_ROLE              int not null,
   RANK_ROLE            varchar(255),
   NAME_ROLE            varchar(255),
   "DESCRIBE"           text,
   CREATEAT             datetime,
   UPDATEAT             datetime,
   ISDELETE             bool,
   primary key (ID_ROLE)
);

/*==============================================================*/
/* Table: SETTING                                               */
/*==============================================================*/
create table SETTING
(
   ID_SETTING           int not null,
   CODENAME             varchar(255),
   KEY                  varchar(255),
   VALUE                text,
   MESSAGE              varchar(255),
   DESCRIPTION          text,
   USERUPDATE           varchar(255),
   CREATEAT             datetime,
   UPDATEAT             datetime,
   ISDELETE             bool,
   primary key (ID_SETTING)
);

/*==============================================================*/
/* Table: USER                                                  */
/*==============================================================*/
create table USER
(
   ID_USER              int not null,
   ID_ROLE              int not null,
   EMAIL                varchar(255),
   FIRSTNAME            varchar(255),
   LASTNAME             varchar(255),
   PHONENUMBER          varchar(15),
   CODEADDRESS          varchar(255),
   ADDRESS              varchar(255),
   PASSWORD             varchar(255),
   CREATEAT             datetime,
   UPDATEAT             datetime,
   ISDELETE             bool,
   primary key (ID_USER)
);

alter table CART add constraint FK_CART_USER foreign key (ID_USER)
      references USER (ID_USER);

alter table CART_ITEM add constraint FK_CARTITEMS_PRODUCT foreign key (ID_PRODUCTDETAILS)
      references PRODUCT_DETAILS (ID_PRODUCTDETAILS);

alter table CART_ITEM add constraint FK_CART_CARTITEMS foreign key (ID_CART)
      references CART (ID_CART);

alter table COMMENT add constraint FK_COMMENT_PRODUCTDETAILS foreign key (ID_PRODUCTDETAILS)
      references PRODUCT_DETAILS (ID_PRODUCTDETAILS);

alter table COMMENT add constraint FK_COMMENT_USER foreign key (ID_USER)
      references USER (ID_USER);

alter table "ORDER" add constraint FK_ORDER_USER foreign key (ID_USER)
      references USER (ID_USER);

alter table ORDER_ITEM add constraint FK_ORDERITEM_PRODUCTDETAILS foreign key (ID_PRODUCTDETAILS)
      references PRODUCT_DETAILS (ID_PRODUCTDETAILS);

alter table ORDER_ITEM add constraint FK_ORDER_ORDERITEM foreign key (ID_ORDER)
      references "ORDER" (ID_ORDER);

alter table PRODUCT add constraint FK_BRAND_PRODUCT foreign key (ID_BRAND)
      references BRAND (ID_BRAND);

alter table PRODUCT add constraint FK_CATEGORY_PRODUCT foreign key (ID_CATEGORY)
      references CATEGORY (ID_CATEGORY);

alter table PRODUCT add constraint FK_PRODUCT_PROMOTION foreign key (ID_PROMOTION)
      references PROMOTION (ID_PROMOTION);

alter table PRODUCT_DETAILS add constraint FK_PRODUCT_PRODUCTDETAILS foreign key (ID_PRODUCT)
      references PRODUCT (ID_PRODUCT);

alter table USER add constraint FK_ROLE_USER foreign key (ID_ROLE)
      references ROLE (ID_ROLE);

