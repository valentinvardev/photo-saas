
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Message
 * 
 */
export type Message = $Result.DefaultSelection<Prisma.$MessagePayload>
/**
 * Model Photo
 * 
 */
export type Photo = $Result.DefaultSelection<Prisma.$PhotoPayload>
/**
 * Model PhotoFolder
 * 
 */
export type PhotoFolder = $Result.DefaultSelection<Prisma.$PhotoFolderPayload>
/**
 * Model Portfolio
 * 
 */
export type Portfolio = $Result.DefaultSelection<Prisma.$PortfolioPayload>
/**
 * Model LinksPage
 * 
 */
export type LinksPage = $Result.DefaultSelection<Prisma.$LinksPagePayload>
/**
 * Model LinkItem
 * 
 */
export type LinkItem = $Result.DefaultSelection<Prisma.$LinkItemPayload>
/**
 * Model Delivery
 * 
 */
export type Delivery = $Result.DefaultSelection<Prisma.$DeliveryPayload>
/**
 * Model DeliveryPhoto
 * 
 */
export type DeliveryPhoto = $Result.DefaultSelection<Prisma.$DeliveryPhotoPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.message`: Exposes CRUD operations for the **Message** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Messages
    * const messages = await prisma.message.findMany()
    * ```
    */
  get message(): Prisma.MessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.photo`: Exposes CRUD operations for the **Photo** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Photos
    * const photos = await prisma.photo.findMany()
    * ```
    */
  get photo(): Prisma.PhotoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.photoFolder`: Exposes CRUD operations for the **PhotoFolder** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more PhotoFolders
    * const photoFolders = await prisma.photoFolder.findMany()
    * ```
    */
  get photoFolder(): Prisma.PhotoFolderDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.portfolio`: Exposes CRUD operations for the **Portfolio** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Portfolios
    * const portfolios = await prisma.portfolio.findMany()
    * ```
    */
  get portfolio(): Prisma.PortfolioDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.linksPage`: Exposes CRUD operations for the **LinksPage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LinksPages
    * const linksPages = await prisma.linksPage.findMany()
    * ```
    */
  get linksPage(): Prisma.LinksPageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.linkItem`: Exposes CRUD operations for the **LinkItem** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LinkItems
    * const linkItems = await prisma.linkItem.findMany()
    * ```
    */
  get linkItem(): Prisma.LinkItemDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.delivery`: Exposes CRUD operations for the **Delivery** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Deliveries
    * const deliveries = await prisma.delivery.findMany()
    * ```
    */
  get delivery(): Prisma.DeliveryDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.deliveryPhoto`: Exposes CRUD operations for the **DeliveryPhoto** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DeliveryPhotos
    * const deliveryPhotos = await prisma.deliveryPhoto.findMany()
    * ```
    */
  get deliveryPhoto(): Prisma.DeliveryPhotoDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.19.3
   * Query Engine version: c2990dca591cba766e3b7ef5d9e8a84796e47ab7
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import Bytes = runtime.Bytes
  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Message: 'Message',
    Photo: 'Photo',
    PhotoFolder: 'PhotoFolder',
    Portfolio: 'Portfolio',
    LinksPage: 'LinksPage',
    LinkItem: 'LinkItem',
    Delivery: 'Delivery',
    DeliveryPhoto: 'DeliveryPhoto'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "user" | "message" | "photo" | "photoFolder" | "portfolio" | "linksPage" | "linkItem" | "delivery" | "deliveryPhoto"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.UserCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.UserUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Message: {
        payload: Prisma.$MessagePayload<ExtArgs>
        fields: Prisma.MessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.MessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.MessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findFirst: {
            args: Prisma.MessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.MessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          findMany: {
            args: Prisma.MessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          create: {
            args: Prisma.MessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          createMany: {
            args: Prisma.MessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.MessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          delete: {
            args: Prisma.MessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          update: {
            args: Prisma.MessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          deleteMany: {
            args: Prisma.MessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.MessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.MessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>[]
          }
          upsert: {
            args: Prisma.MessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$MessagePayload>
          }
          aggregate: {
            args: Prisma.MessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateMessage>
          }
          groupBy: {
            args: Prisma.MessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<MessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.MessageCountArgs<ExtArgs>
            result: $Utils.Optional<MessageCountAggregateOutputType> | number
          }
        }
      }
      Photo: {
        payload: Prisma.$PhotoPayload<ExtArgs>
        fields: Prisma.PhotoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PhotoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PhotoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          findFirst: {
            args: Prisma.PhotoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PhotoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          findMany: {
            args: Prisma.PhotoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>[]
          }
          create: {
            args: Prisma.PhotoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          createMany: {
            args: Prisma.PhotoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PhotoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>[]
          }
          delete: {
            args: Prisma.PhotoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          update: {
            args: Prisma.PhotoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          deleteMany: {
            args: Prisma.PhotoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PhotoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PhotoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>[]
          }
          upsert: {
            args: Prisma.PhotoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoPayload>
          }
          aggregate: {
            args: Prisma.PhotoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePhoto>
          }
          groupBy: {
            args: Prisma.PhotoGroupByArgs<ExtArgs>
            result: $Utils.Optional<PhotoGroupByOutputType>[]
          }
          count: {
            args: Prisma.PhotoCountArgs<ExtArgs>
            result: $Utils.Optional<PhotoCountAggregateOutputType> | number
          }
        }
      }
      PhotoFolder: {
        payload: Prisma.$PhotoFolderPayload<ExtArgs>
        fields: Prisma.PhotoFolderFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PhotoFolderFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoFolderPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PhotoFolderFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoFolderPayload>
          }
          findFirst: {
            args: Prisma.PhotoFolderFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoFolderPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PhotoFolderFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoFolderPayload>
          }
          findMany: {
            args: Prisma.PhotoFolderFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoFolderPayload>[]
          }
          create: {
            args: Prisma.PhotoFolderCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoFolderPayload>
          }
          createMany: {
            args: Prisma.PhotoFolderCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PhotoFolderCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoFolderPayload>[]
          }
          delete: {
            args: Prisma.PhotoFolderDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoFolderPayload>
          }
          update: {
            args: Prisma.PhotoFolderUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoFolderPayload>
          }
          deleteMany: {
            args: Prisma.PhotoFolderDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PhotoFolderUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PhotoFolderUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoFolderPayload>[]
          }
          upsert: {
            args: Prisma.PhotoFolderUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PhotoFolderPayload>
          }
          aggregate: {
            args: Prisma.PhotoFolderAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePhotoFolder>
          }
          groupBy: {
            args: Prisma.PhotoFolderGroupByArgs<ExtArgs>
            result: $Utils.Optional<PhotoFolderGroupByOutputType>[]
          }
          count: {
            args: Prisma.PhotoFolderCountArgs<ExtArgs>
            result: $Utils.Optional<PhotoFolderCountAggregateOutputType> | number
          }
        }
      }
      Portfolio: {
        payload: Prisma.$PortfolioPayload<ExtArgs>
        fields: Prisma.PortfolioFieldRefs
        operations: {
          findUnique: {
            args: Prisma.PortfolioFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PortfolioPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.PortfolioFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PortfolioPayload>
          }
          findFirst: {
            args: Prisma.PortfolioFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PortfolioPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.PortfolioFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PortfolioPayload>
          }
          findMany: {
            args: Prisma.PortfolioFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PortfolioPayload>[]
          }
          create: {
            args: Prisma.PortfolioCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PortfolioPayload>
          }
          createMany: {
            args: Prisma.PortfolioCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.PortfolioCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PortfolioPayload>[]
          }
          delete: {
            args: Prisma.PortfolioDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PortfolioPayload>
          }
          update: {
            args: Prisma.PortfolioUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PortfolioPayload>
          }
          deleteMany: {
            args: Prisma.PortfolioDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.PortfolioUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.PortfolioUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PortfolioPayload>[]
          }
          upsert: {
            args: Prisma.PortfolioUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$PortfolioPayload>
          }
          aggregate: {
            args: Prisma.PortfolioAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregatePortfolio>
          }
          groupBy: {
            args: Prisma.PortfolioGroupByArgs<ExtArgs>
            result: $Utils.Optional<PortfolioGroupByOutputType>[]
          }
          count: {
            args: Prisma.PortfolioCountArgs<ExtArgs>
            result: $Utils.Optional<PortfolioCountAggregateOutputType> | number
          }
        }
      }
      LinksPage: {
        payload: Prisma.$LinksPagePayload<ExtArgs>
        fields: Prisma.LinksPageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LinksPageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinksPagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LinksPageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinksPagePayload>
          }
          findFirst: {
            args: Prisma.LinksPageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinksPagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LinksPageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinksPagePayload>
          }
          findMany: {
            args: Prisma.LinksPageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinksPagePayload>[]
          }
          create: {
            args: Prisma.LinksPageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinksPagePayload>
          }
          createMany: {
            args: Prisma.LinksPageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LinksPageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinksPagePayload>[]
          }
          delete: {
            args: Prisma.LinksPageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinksPagePayload>
          }
          update: {
            args: Prisma.LinksPageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinksPagePayload>
          }
          deleteMany: {
            args: Prisma.LinksPageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LinksPageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LinksPageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinksPagePayload>[]
          }
          upsert: {
            args: Prisma.LinksPageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinksPagePayload>
          }
          aggregate: {
            args: Prisma.LinksPageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLinksPage>
          }
          groupBy: {
            args: Prisma.LinksPageGroupByArgs<ExtArgs>
            result: $Utils.Optional<LinksPageGroupByOutputType>[]
          }
          count: {
            args: Prisma.LinksPageCountArgs<ExtArgs>
            result: $Utils.Optional<LinksPageCountAggregateOutputType> | number
          }
        }
      }
      LinkItem: {
        payload: Prisma.$LinkItemPayload<ExtArgs>
        fields: Prisma.LinkItemFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LinkItemFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkItemPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LinkItemFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkItemPayload>
          }
          findFirst: {
            args: Prisma.LinkItemFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkItemPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LinkItemFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkItemPayload>
          }
          findMany: {
            args: Prisma.LinkItemFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkItemPayload>[]
          }
          create: {
            args: Prisma.LinkItemCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkItemPayload>
          }
          createMany: {
            args: Prisma.LinkItemCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LinkItemCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkItemPayload>[]
          }
          delete: {
            args: Prisma.LinkItemDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkItemPayload>
          }
          update: {
            args: Prisma.LinkItemUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkItemPayload>
          }
          deleteMany: {
            args: Prisma.LinkItemDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LinkItemUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LinkItemUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkItemPayload>[]
          }
          upsert: {
            args: Prisma.LinkItemUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LinkItemPayload>
          }
          aggregate: {
            args: Prisma.LinkItemAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLinkItem>
          }
          groupBy: {
            args: Prisma.LinkItemGroupByArgs<ExtArgs>
            result: $Utils.Optional<LinkItemGroupByOutputType>[]
          }
          count: {
            args: Prisma.LinkItemCountArgs<ExtArgs>
            result: $Utils.Optional<LinkItemCountAggregateOutputType> | number
          }
        }
      }
      Delivery: {
        payload: Prisma.$DeliveryPayload<ExtArgs>
        fields: Prisma.DeliveryFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeliveryFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeliveryFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>
          }
          findFirst: {
            args: Prisma.DeliveryFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeliveryFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>
          }
          findMany: {
            args: Prisma.DeliveryFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>[]
          }
          create: {
            args: Prisma.DeliveryCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>
          }
          createMany: {
            args: Prisma.DeliveryCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeliveryCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>[]
          }
          delete: {
            args: Prisma.DeliveryDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>
          }
          update: {
            args: Prisma.DeliveryUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>
          }
          deleteMany: {
            args: Prisma.DeliveryDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeliveryUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeliveryUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>[]
          }
          upsert: {
            args: Prisma.DeliveryUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPayload>
          }
          aggregate: {
            args: Prisma.DeliveryAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDelivery>
          }
          groupBy: {
            args: Prisma.DeliveryGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeliveryGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeliveryCountArgs<ExtArgs>
            result: $Utils.Optional<DeliveryCountAggregateOutputType> | number
          }
        }
      }
      DeliveryPhoto: {
        payload: Prisma.$DeliveryPhotoPayload<ExtArgs>
        fields: Prisma.DeliveryPhotoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DeliveryPhotoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPhotoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DeliveryPhotoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPhotoPayload>
          }
          findFirst: {
            args: Prisma.DeliveryPhotoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPhotoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DeliveryPhotoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPhotoPayload>
          }
          findMany: {
            args: Prisma.DeliveryPhotoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPhotoPayload>[]
          }
          create: {
            args: Prisma.DeliveryPhotoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPhotoPayload>
          }
          createMany: {
            args: Prisma.DeliveryPhotoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.DeliveryPhotoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPhotoPayload>[]
          }
          delete: {
            args: Prisma.DeliveryPhotoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPhotoPayload>
          }
          update: {
            args: Prisma.DeliveryPhotoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPhotoPayload>
          }
          deleteMany: {
            args: Prisma.DeliveryPhotoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DeliveryPhotoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.DeliveryPhotoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPhotoPayload>[]
          }
          upsert: {
            args: Prisma.DeliveryPhotoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DeliveryPhotoPayload>
          }
          aggregate: {
            args: Prisma.DeliveryPhotoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDeliveryPhoto>
          }
          groupBy: {
            args: Prisma.DeliveryPhotoGroupByArgs<ExtArgs>
            result: $Utils.Optional<DeliveryPhotoGroupByOutputType>[]
          }
          count: {
            args: Prisma.DeliveryPhotoCountArgs<ExtArgs>
            result: $Utils.Optional<DeliveryPhotoCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    user?: UserOmit
    message?: MessageOmit
    photo?: PhotoOmit
    photoFolder?: PhotoFolderOmit
    portfolio?: PortfolioOmit
    linksPage?: LinksPageOmit
    linkItem?: LinkItemOmit
    delivery?: DeliveryOmit
    deliveryPhoto?: DeliveryPhotoOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    photos: number
    photoFolders: number
    portfolios: number
    linksPages: number
    deliveries: number
    messages: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photos?: boolean | UserCountOutputTypeCountPhotosArgs
    photoFolders?: boolean | UserCountOutputTypeCountPhotoFoldersArgs
    portfolios?: boolean | UserCountOutputTypeCountPortfoliosArgs
    linksPages?: boolean | UserCountOutputTypeCountLinksPagesArgs
    deliveries?: boolean | UserCountOutputTypeCountDeliveriesArgs
    messages?: boolean | UserCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhotoWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPhotoFoldersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhotoFolderWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountPortfoliosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PortfolioWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLinksPagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinksPageWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDeliveriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeliveryWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
  }


  /**
   * Count Type PhotoCountOutputType
   */

  export type PhotoCountOutputType = {
    deliveryPhotos: number
  }

  export type PhotoCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    deliveryPhotos?: boolean | PhotoCountOutputTypeCountDeliveryPhotosArgs
  }

  // Custom InputTypes
  /**
   * PhotoCountOutputType without action
   */
  export type PhotoCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoCountOutputType
     */
    select?: PhotoCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PhotoCountOutputType without action
   */
  export type PhotoCountOutputTypeCountDeliveryPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeliveryPhotoWhereInput
  }


  /**
   * Count Type PhotoFolderCountOutputType
   */

  export type PhotoFolderCountOutputType = {
    photos: number
  }

  export type PhotoFolderCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photos?: boolean | PhotoFolderCountOutputTypeCountPhotosArgs
  }

  // Custom InputTypes
  /**
   * PhotoFolderCountOutputType without action
   */
  export type PhotoFolderCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolderCountOutputType
     */
    select?: PhotoFolderCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * PhotoFolderCountOutputType without action
   */
  export type PhotoFolderCountOutputTypeCountPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhotoWhereInput
  }


  /**
   * Count Type LinksPageCountOutputType
   */

  export type LinksPageCountOutputType = {
    links: number
  }

  export type LinksPageCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    links?: boolean | LinksPageCountOutputTypeCountLinksArgs
  }

  // Custom InputTypes
  /**
   * LinksPageCountOutputType without action
   */
  export type LinksPageCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPageCountOutputType
     */
    select?: LinksPageCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LinksPageCountOutputType without action
   */
  export type LinksPageCountOutputTypeCountLinksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinkItemWhereInput
  }


  /**
   * Count Type DeliveryCountOutputType
   */

  export type DeliveryCountOutputType = {
    photos: number
  }

  export type DeliveryCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photos?: boolean | DeliveryCountOutputTypeCountPhotosArgs
  }

  // Custom InputTypes
  /**
   * DeliveryCountOutputType without action
   */
  export type DeliveryCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryCountOutputType
     */
    select?: DeliveryCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DeliveryCountOutputType without action
   */
  export type DeliveryCountOutputTypeCountPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeliveryPhotoWhereInput
  }


  /**
   * Models
   */

  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    avatarUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    avatarUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    avatarUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatarUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatarUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatarUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    avatarUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatarUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    photos?: boolean | User$photosArgs<ExtArgs>
    photoFolders?: boolean | User$photoFoldersArgs<ExtArgs>
    portfolios?: boolean | User$portfoliosArgs<ExtArgs>
    linksPages?: boolean | User$linksPagesArgs<ExtArgs>
    deliveries?: boolean | User$deliveriesArgs<ExtArgs>
    messages?: boolean | User$messagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>

  export type UserSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatarUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatarUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["user"]>

  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    avatarUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "email" | "name" | "avatarUrl" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>
  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    photos?: boolean | User$photosArgs<ExtArgs>
    photoFolders?: boolean | User$photoFoldersArgs<ExtArgs>
    portfolios?: boolean | User$portfoliosArgs<ExtArgs>
    linksPages?: boolean | User$linksPagesArgs<ExtArgs>
    deliveries?: boolean | User$deliveriesArgs<ExtArgs>
    messages?: boolean | User$messagesArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type UserIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type UserIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      photos: Prisma.$PhotoPayload<ExtArgs>[]
      photoFolders: Prisma.$PhotoFolderPayload<ExtArgs>[]
      portfolios: Prisma.$PortfolioPayload<ExtArgs>[]
      linksPages: Prisma.$LinksPagePayload<ExtArgs>[]
      deliveries: Prisma.$DeliveryPayload<ExtArgs>[]
      messages: Prisma.$MessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      avatarUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Users and returns the data saved in the database.
     * @param {UserCreateManyAndReturnArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Users and only return the `id`
     * const userWithIdOnly = await prisma.user.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users and returns the data updated in the database.
     * @param {UserUpdateManyAndReturnArgs} args - Arguments to update many Users.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Users and only return the `id`
     * const userWithIdOnly = await prisma.user.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    photos<T extends User$photosArgs<ExtArgs> = {}>(args?: Subset<T, User$photosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    photoFolders<T extends User$photoFoldersArgs<ExtArgs> = {}>(args?: Subset<T, User$photoFoldersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoFolderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    portfolios<T extends User$portfoliosArgs<ExtArgs> = {}>(args?: Subset<T, User$portfoliosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    linksPages<T extends User$linksPagesArgs<ExtArgs> = {}>(args?: Subset<T, User$linksPagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinksPagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    deliveries<T extends User$deliveriesArgs<ExtArgs> = {}>(args?: Subset<T, User$deliveriesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    messages<T extends User$messagesArgs<ExtArgs> = {}>(args?: Subset<T, User$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User createManyAndReturn
   */
  export type UserCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User updateManyAndReturn
   */
  export type UserUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to update.
     */
    limit?: number
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
    /**
     * Limit how many Users to delete.
     */
    limit?: number
  }

  /**
   * User.photos
   */
  export type User$photosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    where?: PhotoWhereInput
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    cursor?: PhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * User.photoFolders
   */
  export type User$photoFoldersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderInclude<ExtArgs> | null
    where?: PhotoFolderWhereInput
    orderBy?: PhotoFolderOrderByWithRelationInput | PhotoFolderOrderByWithRelationInput[]
    cursor?: PhotoFolderWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PhotoFolderScalarFieldEnum | PhotoFolderScalarFieldEnum[]
  }

  /**
   * User.portfolios
   */
  export type User$portfoliosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: PortfolioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: PortfolioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PortfolioInclude<ExtArgs> | null
    where?: PortfolioWhereInput
    orderBy?: PortfolioOrderByWithRelationInput | PortfolioOrderByWithRelationInput[]
    cursor?: PortfolioWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PortfolioScalarFieldEnum | PortfolioScalarFieldEnum[]
  }

  /**
   * User.linksPages
   */
  export type User$linksPagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPage
     */
    select?: LinksPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinksPage
     */
    omit?: LinksPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinksPageInclude<ExtArgs> | null
    where?: LinksPageWhereInput
    orderBy?: LinksPageOrderByWithRelationInput | LinksPageOrderByWithRelationInput[]
    cursor?: LinksPageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LinksPageScalarFieldEnum | LinksPageScalarFieldEnum[]
  }

  /**
   * User.deliveries
   */
  export type User$deliveriesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Delivery
     */
    omit?: DeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    where?: DeliveryWhereInput
    orderBy?: DeliveryOrderByWithRelationInput | DeliveryOrderByWithRelationInput[]
    cursor?: DeliveryWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeliveryScalarFieldEnum | DeliveryScalarFieldEnum[]
  }

  /**
   * User.messages
   */
  export type User$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    cursor?: MessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Omit specific fields from the User
     */
    omit?: UserOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Message
   */

  export type AggregateMessage = {
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  export type MessageMinAggregateOutputType = {
    id: string | null
    userId: string | null
    authorName: string | null
    body: string | null
    createdAt: Date | null
  }

  export type MessageMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    authorName: string | null
    body: string | null
    createdAt: Date | null
  }

  export type MessageCountAggregateOutputType = {
    id: number
    userId: number
    authorName: number
    body: number
    createdAt: number
    _all: number
  }


  export type MessageMinAggregateInputType = {
    id?: true
    userId?: true
    authorName?: true
    body?: true
    createdAt?: true
  }

  export type MessageMaxAggregateInputType = {
    id?: true
    userId?: true
    authorName?: true
    body?: true
    createdAt?: true
  }

  export type MessageCountAggregateInputType = {
    id?: true
    userId?: true
    authorName?: true
    body?: true
    createdAt?: true
    _all?: true
  }

  export type MessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Message to aggregate.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Messages
    **/
    _count?: true | MessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: MessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: MessageMaxAggregateInputType
  }

  export type GetMessageAggregateType<T extends MessageAggregateArgs> = {
        [P in keyof T & keyof AggregateMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateMessage[P]>
      : GetScalarType<T[P], AggregateMessage[P]>
  }




  export type MessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: MessageWhereInput
    orderBy?: MessageOrderByWithAggregationInput | MessageOrderByWithAggregationInput[]
    by: MessageScalarFieldEnum[] | MessageScalarFieldEnum
    having?: MessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: MessageCountAggregateInputType | true
    _min?: MessageMinAggregateInputType
    _max?: MessageMaxAggregateInputType
  }

  export type MessageGroupByOutputType = {
    id: string
    userId: string
    authorName: string
    body: string
    createdAt: Date
    _count: MessageCountAggregateOutputType | null
    _min: MessageMinAggregateOutputType | null
    _max: MessageMaxAggregateOutputType | null
  }

  type GetMessageGroupByPayload<T extends MessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<MessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof MessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], MessageGroupByOutputType[P]>
            : GetScalarType<T[P], MessageGroupByOutputType[P]>
        }
      >
    >


  export type MessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    authorName?: boolean
    body?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    authorName?: boolean
    body?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    authorName?: boolean
    body?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["message"]>

  export type MessageSelectScalar = {
    id?: boolean
    userId?: boolean
    authorName?: boolean
    body?: boolean
    createdAt?: boolean
  }

  export type MessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "authorName" | "body" | "createdAt", ExtArgs["result"]["message"]>
  export type MessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type MessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $MessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Message"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      authorName: string
      body: string
      createdAt: Date
    }, ExtArgs["result"]["message"]>
    composites: {}
  }

  type MessageGetPayload<S extends boolean | null | undefined | MessageDefaultArgs> = $Result.GetResult<Prisma.$MessagePayload, S>

  type MessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<MessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: MessageCountAggregateInputType | true
    }

  export interface MessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Message'], meta: { name: 'Message' } }
    /**
     * Find zero or one Message that matches the filter.
     * @param {MessageFindUniqueArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends MessageFindUniqueArgs>(args: SelectSubset<T, MessageFindUniqueArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Message that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {MessageFindUniqueOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends MessageFindUniqueOrThrowArgs>(args: SelectSubset<T, MessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends MessageFindFirstArgs>(args?: SelectSubset<T, MessageFindFirstArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Message that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindFirstOrThrowArgs} args - Arguments to find a Message
     * @example
     * // Get one Message
     * const message = await prisma.message.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends MessageFindFirstOrThrowArgs>(args?: SelectSubset<T, MessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Messages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Messages
     * const messages = await prisma.message.findMany()
     * 
     * // Get first 10 Messages
     * const messages = await prisma.message.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const messageWithIdOnly = await prisma.message.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends MessageFindManyArgs>(args?: SelectSubset<T, MessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Message.
     * @param {MessageCreateArgs} args - Arguments to create a Message.
     * @example
     * // Create one Message
     * const Message = await prisma.message.create({
     *   data: {
     *     // ... data to create a Message
     *   }
     * })
     * 
     */
    create<T extends MessageCreateArgs>(args: SelectSubset<T, MessageCreateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Messages.
     * @param {MessageCreateManyArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends MessageCreateManyArgs>(args?: SelectSubset<T, MessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Messages and returns the data saved in the database.
     * @param {MessageCreateManyAndReturnArgs} args - Arguments to create many Messages.
     * @example
     * // Create many Messages
     * const message = await prisma.message.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends MessageCreateManyAndReturnArgs>(args?: SelectSubset<T, MessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Message.
     * @param {MessageDeleteArgs} args - Arguments to delete one Message.
     * @example
     * // Delete one Message
     * const Message = await prisma.message.delete({
     *   where: {
     *     // ... filter to delete one Message
     *   }
     * })
     * 
     */
    delete<T extends MessageDeleteArgs>(args: SelectSubset<T, MessageDeleteArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Message.
     * @param {MessageUpdateArgs} args - Arguments to update one Message.
     * @example
     * // Update one Message
     * const message = await prisma.message.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends MessageUpdateArgs>(args: SelectSubset<T, MessageUpdateArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Messages.
     * @param {MessageDeleteManyArgs} args - Arguments to filter Messages to delete.
     * @example
     * // Delete a few Messages
     * const { count } = await prisma.message.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends MessageDeleteManyArgs>(args?: SelectSubset<T, MessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends MessageUpdateManyArgs>(args: SelectSubset<T, MessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Messages and returns the data updated in the database.
     * @param {MessageUpdateManyAndReturnArgs} args - Arguments to update many Messages.
     * @example
     * // Update many Messages
     * const message = await prisma.message.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Messages and only return the `id`
     * const messageWithIdOnly = await prisma.message.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends MessageUpdateManyAndReturnArgs>(args: SelectSubset<T, MessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Message.
     * @param {MessageUpsertArgs} args - Arguments to update or create a Message.
     * @example
     * // Update or create a Message
     * const message = await prisma.message.upsert({
     *   create: {
     *     // ... data to create a Message
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Message we want to update
     *   }
     * })
     */
    upsert<T extends MessageUpsertArgs>(args: SelectSubset<T, MessageUpsertArgs<ExtArgs>>): Prisma__MessageClient<$Result.GetResult<Prisma.$MessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Messages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageCountArgs} args - Arguments to filter Messages to count.
     * @example
     * // Count the number of Messages
     * const count = await prisma.message.count({
     *   where: {
     *     // ... the filter for the Messages we want to count
     *   }
     * })
    **/
    count<T extends MessageCountArgs>(
      args?: Subset<T, MessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], MessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends MessageAggregateArgs>(args: Subset<T, MessageAggregateArgs>): Prisma.PrismaPromise<GetMessageAggregateType<T>>

    /**
     * Group by Message.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {MessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends MessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: MessageGroupByArgs['orderBy'] }
        : { orderBy?: MessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, MessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Message model
   */
  readonly fields: MessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Message.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__MessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Message model
   */
  interface MessageFieldRefs {
    readonly id: FieldRef<"Message", 'String'>
    readonly userId: FieldRef<"Message", 'String'>
    readonly authorName: FieldRef<"Message", 'String'>
    readonly body: FieldRef<"Message", 'String'>
    readonly createdAt: FieldRef<"Message", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Message findUnique
   */
  export type MessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findUniqueOrThrow
   */
  export type MessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message findFirst
   */
  export type MessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findFirstOrThrow
   */
  export type MessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Message to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Messages.
     */
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message findMany
   */
  export type MessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter, which Messages to fetch.
     */
    where?: MessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Messages to fetch.
     */
    orderBy?: MessageOrderByWithRelationInput | MessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Messages.
     */
    cursor?: MessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Messages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Messages.
     */
    skip?: number
    distinct?: MessageScalarFieldEnum | MessageScalarFieldEnum[]
  }

  /**
   * Message create
   */
  export type MessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to create a Message.
     */
    data: XOR<MessageCreateInput, MessageUncheckedCreateInput>
  }

  /**
   * Message createMany
   */
  export type MessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Message createManyAndReturn
   */
  export type MessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to create many Messages.
     */
    data: MessageCreateManyInput | MessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message update
   */
  export type MessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The data needed to update a Message.
     */
    data: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
    /**
     * Choose, which Message to update.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message updateMany
   */
  export type MessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
  }

  /**
   * Message updateManyAndReturn
   */
  export type MessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * The data used to update Messages.
     */
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyInput>
    /**
     * Filter which Messages to update
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Message upsert
   */
  export type MessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * The filter to search for the Message to update in case it exists.
     */
    where: MessageWhereUniqueInput
    /**
     * In case the Message found by the `where` argument doesn't exist, create a new Message with this data.
     */
    create: XOR<MessageCreateInput, MessageUncheckedCreateInput>
    /**
     * In case the Message was found with the provided `where` argument, update it with this data.
     */
    update: XOR<MessageUpdateInput, MessageUncheckedUpdateInput>
  }

  /**
   * Message delete
   */
  export type MessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
    /**
     * Filter which Message to delete.
     */
    where: MessageWhereUniqueInput
  }

  /**
   * Message deleteMany
   */
  export type MessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Messages to delete
     */
    where?: MessageWhereInput
    /**
     * Limit how many Messages to delete.
     */
    limit?: number
  }

  /**
   * Message without action
   */
  export type MessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Message
     */
    select?: MessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Message
     */
    omit?: MessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: MessageInclude<ExtArgs> | null
  }


  /**
   * Model Photo
   */

  export type AggregatePhoto = {
    _count: PhotoCountAggregateOutputType | null
    _avg: PhotoAvgAggregateOutputType | null
    _sum: PhotoSumAggregateOutputType | null
    _min: PhotoMinAggregateOutputType | null
    _max: PhotoMaxAggregateOutputType | null
  }

  export type PhotoAvgAggregateOutputType = {
    size: number | null
    width: number | null
    height: number | null
  }

  export type PhotoSumAggregateOutputType = {
    size: number | null
    width: number | null
    height: number | null
  }

  export type PhotoMinAggregateOutputType = {
    id: string | null
    userId: string | null
    url: string | null
    storagePath: string | null
    filename: string | null
    size: number | null
    width: number | null
    height: number | null
    mimeType: string | null
    hasPreview: boolean | null
    createdAt: Date | null
    folderId: string | null
  }

  export type PhotoMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    url: string | null
    storagePath: string | null
    filename: string | null
    size: number | null
    width: number | null
    height: number | null
    mimeType: string | null
    hasPreview: boolean | null
    createdAt: Date | null
    folderId: string | null
  }

  export type PhotoCountAggregateOutputType = {
    id: number
    userId: number
    url: number
    storagePath: number
    filename: number
    size: number
    width: number
    height: number
    mimeType: number
    hasPreview: number
    createdAt: number
    folderId: number
    _all: number
  }


  export type PhotoAvgAggregateInputType = {
    size?: true
    width?: true
    height?: true
  }

  export type PhotoSumAggregateInputType = {
    size?: true
    width?: true
    height?: true
  }

  export type PhotoMinAggregateInputType = {
    id?: true
    userId?: true
    url?: true
    storagePath?: true
    filename?: true
    size?: true
    width?: true
    height?: true
    mimeType?: true
    hasPreview?: true
    createdAt?: true
    folderId?: true
  }

  export type PhotoMaxAggregateInputType = {
    id?: true
    userId?: true
    url?: true
    storagePath?: true
    filename?: true
    size?: true
    width?: true
    height?: true
    mimeType?: true
    hasPreview?: true
    createdAt?: true
    folderId?: true
  }

  export type PhotoCountAggregateInputType = {
    id?: true
    userId?: true
    url?: true
    storagePath?: true
    filename?: true
    size?: true
    width?: true
    height?: true
    mimeType?: true
    hasPreview?: true
    createdAt?: true
    folderId?: true
    _all?: true
  }

  export type PhotoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Photo to aggregate.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Photos
    **/
    _count?: true | PhotoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PhotoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PhotoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PhotoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PhotoMaxAggregateInputType
  }

  export type GetPhotoAggregateType<T extends PhotoAggregateArgs> = {
        [P in keyof T & keyof AggregatePhoto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePhoto[P]>
      : GetScalarType<T[P], AggregatePhoto[P]>
  }




  export type PhotoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhotoWhereInput
    orderBy?: PhotoOrderByWithAggregationInput | PhotoOrderByWithAggregationInput[]
    by: PhotoScalarFieldEnum[] | PhotoScalarFieldEnum
    having?: PhotoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PhotoCountAggregateInputType | true
    _avg?: PhotoAvgAggregateInputType
    _sum?: PhotoSumAggregateInputType
    _min?: PhotoMinAggregateInputType
    _max?: PhotoMaxAggregateInputType
  }

  export type PhotoGroupByOutputType = {
    id: string
    userId: string
    url: string
    storagePath: string
    filename: string
    size: number
    width: number | null
    height: number | null
    mimeType: string
    hasPreview: boolean
    createdAt: Date
    folderId: string | null
    _count: PhotoCountAggregateOutputType | null
    _avg: PhotoAvgAggregateOutputType | null
    _sum: PhotoSumAggregateOutputType | null
    _min: PhotoMinAggregateOutputType | null
    _max: PhotoMaxAggregateOutputType | null
  }

  type GetPhotoGroupByPayload<T extends PhotoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PhotoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PhotoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PhotoGroupByOutputType[P]>
            : GetScalarType<T[P], PhotoGroupByOutputType[P]>
        }
      >
    >


  export type PhotoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    url?: boolean
    storagePath?: boolean
    filename?: boolean
    size?: boolean
    width?: boolean
    height?: boolean
    mimeType?: boolean
    hasPreview?: boolean
    createdAt?: boolean
    folderId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    folder?: boolean | Photo$folderArgs<ExtArgs>
    deliveryPhotos?: boolean | Photo$deliveryPhotosArgs<ExtArgs>
    _count?: boolean | PhotoCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["photo"]>

  export type PhotoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    url?: boolean
    storagePath?: boolean
    filename?: boolean
    size?: boolean
    width?: boolean
    height?: boolean
    mimeType?: boolean
    hasPreview?: boolean
    createdAt?: boolean
    folderId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    folder?: boolean | Photo$folderArgs<ExtArgs>
  }, ExtArgs["result"]["photo"]>

  export type PhotoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    url?: boolean
    storagePath?: boolean
    filename?: boolean
    size?: boolean
    width?: boolean
    height?: boolean
    mimeType?: boolean
    hasPreview?: boolean
    createdAt?: boolean
    folderId?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    folder?: boolean | Photo$folderArgs<ExtArgs>
  }, ExtArgs["result"]["photo"]>

  export type PhotoSelectScalar = {
    id?: boolean
    userId?: boolean
    url?: boolean
    storagePath?: boolean
    filename?: boolean
    size?: boolean
    width?: boolean
    height?: boolean
    mimeType?: boolean
    hasPreview?: boolean
    createdAt?: boolean
    folderId?: boolean
  }

  export type PhotoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "url" | "storagePath" | "filename" | "size" | "width" | "height" | "mimeType" | "hasPreview" | "createdAt" | "folderId", ExtArgs["result"]["photo"]>
  export type PhotoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    folder?: boolean | Photo$folderArgs<ExtArgs>
    deliveryPhotos?: boolean | Photo$deliveryPhotosArgs<ExtArgs>
    _count?: boolean | PhotoCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PhotoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    folder?: boolean | Photo$folderArgs<ExtArgs>
  }
  export type PhotoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    folder?: boolean | Photo$folderArgs<ExtArgs>
  }

  export type $PhotoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Photo"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      folder: Prisma.$PhotoFolderPayload<ExtArgs> | null
      deliveryPhotos: Prisma.$DeliveryPhotoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      url: string
      storagePath: string
      filename: string
      size: number
      width: number | null
      height: number | null
      mimeType: string
      hasPreview: boolean
      createdAt: Date
      folderId: string | null
    }, ExtArgs["result"]["photo"]>
    composites: {}
  }

  type PhotoGetPayload<S extends boolean | null | undefined | PhotoDefaultArgs> = $Result.GetResult<Prisma.$PhotoPayload, S>

  type PhotoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PhotoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PhotoCountAggregateInputType | true
    }

  export interface PhotoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Photo'], meta: { name: 'Photo' } }
    /**
     * Find zero or one Photo that matches the filter.
     * @param {PhotoFindUniqueArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PhotoFindUniqueArgs>(args: SelectSubset<T, PhotoFindUniqueArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Photo that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PhotoFindUniqueOrThrowArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PhotoFindUniqueOrThrowArgs>(args: SelectSubset<T, PhotoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Photo that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFindFirstArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PhotoFindFirstArgs>(args?: SelectSubset<T, PhotoFindFirstArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Photo that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFindFirstOrThrowArgs} args - Arguments to find a Photo
     * @example
     * // Get one Photo
     * const photo = await prisma.photo.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PhotoFindFirstOrThrowArgs>(args?: SelectSubset<T, PhotoFindFirstOrThrowArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Photos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Photos
     * const photos = await prisma.photo.findMany()
     * 
     * // Get first 10 Photos
     * const photos = await prisma.photo.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const photoWithIdOnly = await prisma.photo.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PhotoFindManyArgs>(args?: SelectSubset<T, PhotoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Photo.
     * @param {PhotoCreateArgs} args - Arguments to create a Photo.
     * @example
     * // Create one Photo
     * const Photo = await prisma.photo.create({
     *   data: {
     *     // ... data to create a Photo
     *   }
     * })
     * 
     */
    create<T extends PhotoCreateArgs>(args: SelectSubset<T, PhotoCreateArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Photos.
     * @param {PhotoCreateManyArgs} args - Arguments to create many Photos.
     * @example
     * // Create many Photos
     * const photo = await prisma.photo.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PhotoCreateManyArgs>(args?: SelectSubset<T, PhotoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Photos and returns the data saved in the database.
     * @param {PhotoCreateManyAndReturnArgs} args - Arguments to create many Photos.
     * @example
     * // Create many Photos
     * const photo = await prisma.photo.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Photos and only return the `id`
     * const photoWithIdOnly = await prisma.photo.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PhotoCreateManyAndReturnArgs>(args?: SelectSubset<T, PhotoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Photo.
     * @param {PhotoDeleteArgs} args - Arguments to delete one Photo.
     * @example
     * // Delete one Photo
     * const Photo = await prisma.photo.delete({
     *   where: {
     *     // ... filter to delete one Photo
     *   }
     * })
     * 
     */
    delete<T extends PhotoDeleteArgs>(args: SelectSubset<T, PhotoDeleteArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Photo.
     * @param {PhotoUpdateArgs} args - Arguments to update one Photo.
     * @example
     * // Update one Photo
     * const photo = await prisma.photo.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PhotoUpdateArgs>(args: SelectSubset<T, PhotoUpdateArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Photos.
     * @param {PhotoDeleteManyArgs} args - Arguments to filter Photos to delete.
     * @example
     * // Delete a few Photos
     * const { count } = await prisma.photo.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PhotoDeleteManyArgs>(args?: SelectSubset<T, PhotoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Photos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Photos
     * const photo = await prisma.photo.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PhotoUpdateManyArgs>(args: SelectSubset<T, PhotoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Photos and returns the data updated in the database.
     * @param {PhotoUpdateManyAndReturnArgs} args - Arguments to update many Photos.
     * @example
     * // Update many Photos
     * const photo = await prisma.photo.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Photos and only return the `id`
     * const photoWithIdOnly = await prisma.photo.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PhotoUpdateManyAndReturnArgs>(args: SelectSubset<T, PhotoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Photo.
     * @param {PhotoUpsertArgs} args - Arguments to update or create a Photo.
     * @example
     * // Update or create a Photo
     * const photo = await prisma.photo.upsert({
     *   create: {
     *     // ... data to create a Photo
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Photo we want to update
     *   }
     * })
     */
    upsert<T extends PhotoUpsertArgs>(args: SelectSubset<T, PhotoUpsertArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Photos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoCountArgs} args - Arguments to filter Photos to count.
     * @example
     * // Count the number of Photos
     * const count = await prisma.photo.count({
     *   where: {
     *     // ... the filter for the Photos we want to count
     *   }
     * })
    **/
    count<T extends PhotoCountArgs>(
      args?: Subset<T, PhotoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PhotoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Photo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PhotoAggregateArgs>(args: Subset<T, PhotoAggregateArgs>): Prisma.PrismaPromise<GetPhotoAggregateType<T>>

    /**
     * Group by Photo.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PhotoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PhotoGroupByArgs['orderBy'] }
        : { orderBy?: PhotoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PhotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPhotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Photo model
   */
  readonly fields: PhotoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Photo.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PhotoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    folder<T extends Photo$folderArgs<ExtArgs> = {}>(args?: Subset<T, Photo$folderArgs<ExtArgs>>): Prisma__PhotoFolderClient<$Result.GetResult<Prisma.$PhotoFolderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    deliveryPhotos<T extends Photo$deliveryPhotosArgs<ExtArgs> = {}>(args?: Subset<T, Photo$deliveryPhotosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliveryPhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Photo model
   */
  interface PhotoFieldRefs {
    readonly id: FieldRef<"Photo", 'String'>
    readonly userId: FieldRef<"Photo", 'String'>
    readonly url: FieldRef<"Photo", 'String'>
    readonly storagePath: FieldRef<"Photo", 'String'>
    readonly filename: FieldRef<"Photo", 'String'>
    readonly size: FieldRef<"Photo", 'Int'>
    readonly width: FieldRef<"Photo", 'Int'>
    readonly height: FieldRef<"Photo", 'Int'>
    readonly mimeType: FieldRef<"Photo", 'String'>
    readonly hasPreview: FieldRef<"Photo", 'Boolean'>
    readonly createdAt: FieldRef<"Photo", 'DateTime'>
    readonly folderId: FieldRef<"Photo", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Photo findUnique
   */
  export type PhotoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo findUniqueOrThrow
   */
  export type PhotoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo findFirst
   */
  export type PhotoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Photos.
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Photos.
     */
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Photo findFirstOrThrow
   */
  export type PhotoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photo to fetch.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Photos.
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Photos.
     */
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Photo findMany
   */
  export type PhotoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter, which Photos to fetch.
     */
    where?: PhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Photos to fetch.
     */
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Photos.
     */
    cursor?: PhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Photos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Photos.
     */
    skip?: number
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * Photo create
   */
  export type PhotoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * The data needed to create a Photo.
     */
    data: XOR<PhotoCreateInput, PhotoUncheckedCreateInput>
  }

  /**
   * Photo createMany
   */
  export type PhotoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Photos.
     */
    data: PhotoCreateManyInput | PhotoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Photo createManyAndReturn
   */
  export type PhotoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * The data used to create many Photos.
     */
    data: PhotoCreateManyInput | PhotoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Photo update
   */
  export type PhotoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * The data needed to update a Photo.
     */
    data: XOR<PhotoUpdateInput, PhotoUncheckedUpdateInput>
    /**
     * Choose, which Photo to update.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo updateMany
   */
  export type PhotoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Photos.
     */
    data: XOR<PhotoUpdateManyMutationInput, PhotoUncheckedUpdateManyInput>
    /**
     * Filter which Photos to update
     */
    where?: PhotoWhereInput
    /**
     * Limit how many Photos to update.
     */
    limit?: number
  }

  /**
   * Photo updateManyAndReturn
   */
  export type PhotoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * The data used to update Photos.
     */
    data: XOR<PhotoUpdateManyMutationInput, PhotoUncheckedUpdateManyInput>
    /**
     * Filter which Photos to update
     */
    where?: PhotoWhereInput
    /**
     * Limit how many Photos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Photo upsert
   */
  export type PhotoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * The filter to search for the Photo to update in case it exists.
     */
    where: PhotoWhereUniqueInput
    /**
     * In case the Photo found by the `where` argument doesn't exist, create a new Photo with this data.
     */
    create: XOR<PhotoCreateInput, PhotoUncheckedCreateInput>
    /**
     * In case the Photo was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PhotoUpdateInput, PhotoUncheckedUpdateInput>
  }

  /**
   * Photo delete
   */
  export type PhotoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    /**
     * Filter which Photo to delete.
     */
    where: PhotoWhereUniqueInput
  }

  /**
   * Photo deleteMany
   */
  export type PhotoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Photos to delete
     */
    where?: PhotoWhereInput
    /**
     * Limit how many Photos to delete.
     */
    limit?: number
  }

  /**
   * Photo.folder
   */
  export type Photo$folderArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderInclude<ExtArgs> | null
    where?: PhotoFolderWhereInput
  }

  /**
   * Photo.deliveryPhotos
   */
  export type Photo$deliveryPhotosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoInclude<ExtArgs> | null
    where?: DeliveryPhotoWhereInput
    orderBy?: DeliveryPhotoOrderByWithRelationInput | DeliveryPhotoOrderByWithRelationInput[]
    cursor?: DeliveryPhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeliveryPhotoScalarFieldEnum | DeliveryPhotoScalarFieldEnum[]
  }

  /**
   * Photo without action
   */
  export type PhotoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
  }


  /**
   * Model PhotoFolder
   */

  export type AggregatePhotoFolder = {
    _count: PhotoFolderCountAggregateOutputType | null
    _min: PhotoFolderMinAggregateOutputType | null
    _max: PhotoFolderMaxAggregateOutputType | null
  }

  export type PhotoFolderMinAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    createdAt: Date | null
  }

  export type PhotoFolderMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    name: string | null
    createdAt: Date | null
  }

  export type PhotoFolderCountAggregateOutputType = {
    id: number
    userId: number
    name: number
    createdAt: number
    _all: number
  }


  export type PhotoFolderMinAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    createdAt?: true
  }

  export type PhotoFolderMaxAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    createdAt?: true
  }

  export type PhotoFolderCountAggregateInputType = {
    id?: true
    userId?: true
    name?: true
    createdAt?: true
    _all?: true
  }

  export type PhotoFolderAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PhotoFolder to aggregate.
     */
    where?: PhotoFolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhotoFolders to fetch.
     */
    orderBy?: PhotoFolderOrderByWithRelationInput | PhotoFolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PhotoFolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhotoFolders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhotoFolders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned PhotoFolders
    **/
    _count?: true | PhotoFolderCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PhotoFolderMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PhotoFolderMaxAggregateInputType
  }

  export type GetPhotoFolderAggregateType<T extends PhotoFolderAggregateArgs> = {
        [P in keyof T & keyof AggregatePhotoFolder]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePhotoFolder[P]>
      : GetScalarType<T[P], AggregatePhotoFolder[P]>
  }




  export type PhotoFolderGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PhotoFolderWhereInput
    orderBy?: PhotoFolderOrderByWithAggregationInput | PhotoFolderOrderByWithAggregationInput[]
    by: PhotoFolderScalarFieldEnum[] | PhotoFolderScalarFieldEnum
    having?: PhotoFolderScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PhotoFolderCountAggregateInputType | true
    _min?: PhotoFolderMinAggregateInputType
    _max?: PhotoFolderMaxAggregateInputType
  }

  export type PhotoFolderGroupByOutputType = {
    id: string
    userId: string
    name: string
    createdAt: Date
    _count: PhotoFolderCountAggregateOutputType | null
    _min: PhotoFolderMinAggregateOutputType | null
    _max: PhotoFolderMaxAggregateOutputType | null
  }

  type GetPhotoFolderGroupByPayload<T extends PhotoFolderGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PhotoFolderGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PhotoFolderGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PhotoFolderGroupByOutputType[P]>
            : GetScalarType<T[P], PhotoFolderGroupByOutputType[P]>
        }
      >
    >


  export type PhotoFolderSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    photos?: boolean | PhotoFolder$photosArgs<ExtArgs>
    _count?: boolean | PhotoFolderCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["photoFolder"]>

  export type PhotoFolderSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["photoFolder"]>

  export type PhotoFolderSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    name?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["photoFolder"]>

  export type PhotoFolderSelectScalar = {
    id?: boolean
    userId?: boolean
    name?: boolean
    createdAt?: boolean
  }

  export type PhotoFolderOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "name" | "createdAt", ExtArgs["result"]["photoFolder"]>
  export type PhotoFolderInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    photos?: boolean | PhotoFolder$photosArgs<ExtArgs>
    _count?: boolean | PhotoFolderCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type PhotoFolderIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PhotoFolderIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PhotoFolderPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "PhotoFolder"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      photos: Prisma.$PhotoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      name: string
      createdAt: Date
    }, ExtArgs["result"]["photoFolder"]>
    composites: {}
  }

  type PhotoFolderGetPayload<S extends boolean | null | undefined | PhotoFolderDefaultArgs> = $Result.GetResult<Prisma.$PhotoFolderPayload, S>

  type PhotoFolderCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PhotoFolderFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PhotoFolderCountAggregateInputType | true
    }

  export interface PhotoFolderDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['PhotoFolder'], meta: { name: 'PhotoFolder' } }
    /**
     * Find zero or one PhotoFolder that matches the filter.
     * @param {PhotoFolderFindUniqueArgs} args - Arguments to find a PhotoFolder
     * @example
     * // Get one PhotoFolder
     * const photoFolder = await prisma.photoFolder.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PhotoFolderFindUniqueArgs>(args: SelectSubset<T, PhotoFolderFindUniqueArgs<ExtArgs>>): Prisma__PhotoFolderClient<$Result.GetResult<Prisma.$PhotoFolderPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one PhotoFolder that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PhotoFolderFindUniqueOrThrowArgs} args - Arguments to find a PhotoFolder
     * @example
     * // Get one PhotoFolder
     * const photoFolder = await prisma.photoFolder.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PhotoFolderFindUniqueOrThrowArgs>(args: SelectSubset<T, PhotoFolderFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PhotoFolderClient<$Result.GetResult<Prisma.$PhotoFolderPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PhotoFolder that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFolderFindFirstArgs} args - Arguments to find a PhotoFolder
     * @example
     * // Get one PhotoFolder
     * const photoFolder = await prisma.photoFolder.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PhotoFolderFindFirstArgs>(args?: SelectSubset<T, PhotoFolderFindFirstArgs<ExtArgs>>): Prisma__PhotoFolderClient<$Result.GetResult<Prisma.$PhotoFolderPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first PhotoFolder that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFolderFindFirstOrThrowArgs} args - Arguments to find a PhotoFolder
     * @example
     * // Get one PhotoFolder
     * const photoFolder = await prisma.photoFolder.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PhotoFolderFindFirstOrThrowArgs>(args?: SelectSubset<T, PhotoFolderFindFirstOrThrowArgs<ExtArgs>>): Prisma__PhotoFolderClient<$Result.GetResult<Prisma.$PhotoFolderPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more PhotoFolders that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFolderFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all PhotoFolders
     * const photoFolders = await prisma.photoFolder.findMany()
     * 
     * // Get first 10 PhotoFolders
     * const photoFolders = await prisma.photoFolder.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const photoFolderWithIdOnly = await prisma.photoFolder.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PhotoFolderFindManyArgs>(args?: SelectSubset<T, PhotoFolderFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoFolderPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a PhotoFolder.
     * @param {PhotoFolderCreateArgs} args - Arguments to create a PhotoFolder.
     * @example
     * // Create one PhotoFolder
     * const PhotoFolder = await prisma.photoFolder.create({
     *   data: {
     *     // ... data to create a PhotoFolder
     *   }
     * })
     * 
     */
    create<T extends PhotoFolderCreateArgs>(args: SelectSubset<T, PhotoFolderCreateArgs<ExtArgs>>): Prisma__PhotoFolderClient<$Result.GetResult<Prisma.$PhotoFolderPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many PhotoFolders.
     * @param {PhotoFolderCreateManyArgs} args - Arguments to create many PhotoFolders.
     * @example
     * // Create many PhotoFolders
     * const photoFolder = await prisma.photoFolder.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PhotoFolderCreateManyArgs>(args?: SelectSubset<T, PhotoFolderCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many PhotoFolders and returns the data saved in the database.
     * @param {PhotoFolderCreateManyAndReturnArgs} args - Arguments to create many PhotoFolders.
     * @example
     * // Create many PhotoFolders
     * const photoFolder = await prisma.photoFolder.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many PhotoFolders and only return the `id`
     * const photoFolderWithIdOnly = await prisma.photoFolder.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PhotoFolderCreateManyAndReturnArgs>(args?: SelectSubset<T, PhotoFolderCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoFolderPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a PhotoFolder.
     * @param {PhotoFolderDeleteArgs} args - Arguments to delete one PhotoFolder.
     * @example
     * // Delete one PhotoFolder
     * const PhotoFolder = await prisma.photoFolder.delete({
     *   where: {
     *     // ... filter to delete one PhotoFolder
     *   }
     * })
     * 
     */
    delete<T extends PhotoFolderDeleteArgs>(args: SelectSubset<T, PhotoFolderDeleteArgs<ExtArgs>>): Prisma__PhotoFolderClient<$Result.GetResult<Prisma.$PhotoFolderPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one PhotoFolder.
     * @param {PhotoFolderUpdateArgs} args - Arguments to update one PhotoFolder.
     * @example
     * // Update one PhotoFolder
     * const photoFolder = await prisma.photoFolder.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PhotoFolderUpdateArgs>(args: SelectSubset<T, PhotoFolderUpdateArgs<ExtArgs>>): Prisma__PhotoFolderClient<$Result.GetResult<Prisma.$PhotoFolderPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more PhotoFolders.
     * @param {PhotoFolderDeleteManyArgs} args - Arguments to filter PhotoFolders to delete.
     * @example
     * // Delete a few PhotoFolders
     * const { count } = await prisma.photoFolder.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PhotoFolderDeleteManyArgs>(args?: SelectSubset<T, PhotoFolderDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PhotoFolders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFolderUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many PhotoFolders
     * const photoFolder = await prisma.photoFolder.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PhotoFolderUpdateManyArgs>(args: SelectSubset<T, PhotoFolderUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more PhotoFolders and returns the data updated in the database.
     * @param {PhotoFolderUpdateManyAndReturnArgs} args - Arguments to update many PhotoFolders.
     * @example
     * // Update many PhotoFolders
     * const photoFolder = await prisma.photoFolder.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more PhotoFolders and only return the `id`
     * const photoFolderWithIdOnly = await prisma.photoFolder.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PhotoFolderUpdateManyAndReturnArgs>(args: SelectSubset<T, PhotoFolderUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoFolderPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one PhotoFolder.
     * @param {PhotoFolderUpsertArgs} args - Arguments to update or create a PhotoFolder.
     * @example
     * // Update or create a PhotoFolder
     * const photoFolder = await prisma.photoFolder.upsert({
     *   create: {
     *     // ... data to create a PhotoFolder
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the PhotoFolder we want to update
     *   }
     * })
     */
    upsert<T extends PhotoFolderUpsertArgs>(args: SelectSubset<T, PhotoFolderUpsertArgs<ExtArgs>>): Prisma__PhotoFolderClient<$Result.GetResult<Prisma.$PhotoFolderPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of PhotoFolders.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFolderCountArgs} args - Arguments to filter PhotoFolders to count.
     * @example
     * // Count the number of PhotoFolders
     * const count = await prisma.photoFolder.count({
     *   where: {
     *     // ... the filter for the PhotoFolders we want to count
     *   }
     * })
    **/
    count<T extends PhotoFolderCountArgs>(
      args?: Subset<T, PhotoFolderCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PhotoFolderCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a PhotoFolder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFolderAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PhotoFolderAggregateArgs>(args: Subset<T, PhotoFolderAggregateArgs>): Prisma.PrismaPromise<GetPhotoFolderAggregateType<T>>

    /**
     * Group by PhotoFolder.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PhotoFolderGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PhotoFolderGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PhotoFolderGroupByArgs['orderBy'] }
        : { orderBy?: PhotoFolderGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PhotoFolderGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPhotoFolderGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the PhotoFolder model
   */
  readonly fields: PhotoFolderFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for PhotoFolder.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PhotoFolderClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    photos<T extends PhotoFolder$photosArgs<ExtArgs> = {}>(args?: Subset<T, PhotoFolder$photosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the PhotoFolder model
   */
  interface PhotoFolderFieldRefs {
    readonly id: FieldRef<"PhotoFolder", 'String'>
    readonly userId: FieldRef<"PhotoFolder", 'String'>
    readonly name: FieldRef<"PhotoFolder", 'String'>
    readonly createdAt: FieldRef<"PhotoFolder", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * PhotoFolder findUnique
   */
  export type PhotoFolderFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderInclude<ExtArgs> | null
    /**
     * Filter, which PhotoFolder to fetch.
     */
    where: PhotoFolderWhereUniqueInput
  }

  /**
   * PhotoFolder findUniqueOrThrow
   */
  export type PhotoFolderFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderInclude<ExtArgs> | null
    /**
     * Filter, which PhotoFolder to fetch.
     */
    where: PhotoFolderWhereUniqueInput
  }

  /**
   * PhotoFolder findFirst
   */
  export type PhotoFolderFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderInclude<ExtArgs> | null
    /**
     * Filter, which PhotoFolder to fetch.
     */
    where?: PhotoFolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhotoFolders to fetch.
     */
    orderBy?: PhotoFolderOrderByWithRelationInput | PhotoFolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PhotoFolders.
     */
    cursor?: PhotoFolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhotoFolders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhotoFolders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PhotoFolders.
     */
    distinct?: PhotoFolderScalarFieldEnum | PhotoFolderScalarFieldEnum[]
  }

  /**
   * PhotoFolder findFirstOrThrow
   */
  export type PhotoFolderFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderInclude<ExtArgs> | null
    /**
     * Filter, which PhotoFolder to fetch.
     */
    where?: PhotoFolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhotoFolders to fetch.
     */
    orderBy?: PhotoFolderOrderByWithRelationInput | PhotoFolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for PhotoFolders.
     */
    cursor?: PhotoFolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhotoFolders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhotoFolders.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of PhotoFolders.
     */
    distinct?: PhotoFolderScalarFieldEnum | PhotoFolderScalarFieldEnum[]
  }

  /**
   * PhotoFolder findMany
   */
  export type PhotoFolderFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderInclude<ExtArgs> | null
    /**
     * Filter, which PhotoFolders to fetch.
     */
    where?: PhotoFolderWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of PhotoFolders to fetch.
     */
    orderBy?: PhotoFolderOrderByWithRelationInput | PhotoFolderOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing PhotoFolders.
     */
    cursor?: PhotoFolderWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` PhotoFolders from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` PhotoFolders.
     */
    skip?: number
    distinct?: PhotoFolderScalarFieldEnum | PhotoFolderScalarFieldEnum[]
  }

  /**
   * PhotoFolder create
   */
  export type PhotoFolderCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderInclude<ExtArgs> | null
    /**
     * The data needed to create a PhotoFolder.
     */
    data: XOR<PhotoFolderCreateInput, PhotoFolderUncheckedCreateInput>
  }

  /**
   * PhotoFolder createMany
   */
  export type PhotoFolderCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many PhotoFolders.
     */
    data: PhotoFolderCreateManyInput | PhotoFolderCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * PhotoFolder createManyAndReturn
   */
  export type PhotoFolderCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * The data used to create many PhotoFolders.
     */
    data: PhotoFolderCreateManyInput | PhotoFolderCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * PhotoFolder update
   */
  export type PhotoFolderUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderInclude<ExtArgs> | null
    /**
     * The data needed to update a PhotoFolder.
     */
    data: XOR<PhotoFolderUpdateInput, PhotoFolderUncheckedUpdateInput>
    /**
     * Choose, which PhotoFolder to update.
     */
    where: PhotoFolderWhereUniqueInput
  }

  /**
   * PhotoFolder updateMany
   */
  export type PhotoFolderUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update PhotoFolders.
     */
    data: XOR<PhotoFolderUpdateManyMutationInput, PhotoFolderUncheckedUpdateManyInput>
    /**
     * Filter which PhotoFolders to update
     */
    where?: PhotoFolderWhereInput
    /**
     * Limit how many PhotoFolders to update.
     */
    limit?: number
  }

  /**
   * PhotoFolder updateManyAndReturn
   */
  export type PhotoFolderUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * The data used to update PhotoFolders.
     */
    data: XOR<PhotoFolderUpdateManyMutationInput, PhotoFolderUncheckedUpdateManyInput>
    /**
     * Filter which PhotoFolders to update
     */
    where?: PhotoFolderWhereInput
    /**
     * Limit how many PhotoFolders to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * PhotoFolder upsert
   */
  export type PhotoFolderUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderInclude<ExtArgs> | null
    /**
     * The filter to search for the PhotoFolder to update in case it exists.
     */
    where: PhotoFolderWhereUniqueInput
    /**
     * In case the PhotoFolder found by the `where` argument doesn't exist, create a new PhotoFolder with this data.
     */
    create: XOR<PhotoFolderCreateInput, PhotoFolderUncheckedCreateInput>
    /**
     * In case the PhotoFolder was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PhotoFolderUpdateInput, PhotoFolderUncheckedUpdateInput>
  }

  /**
   * PhotoFolder delete
   */
  export type PhotoFolderDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderInclude<ExtArgs> | null
    /**
     * Filter which PhotoFolder to delete.
     */
    where: PhotoFolderWhereUniqueInput
  }

  /**
   * PhotoFolder deleteMany
   */
  export type PhotoFolderDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which PhotoFolders to delete
     */
    where?: PhotoFolderWhereInput
    /**
     * Limit how many PhotoFolders to delete.
     */
    limit?: number
  }

  /**
   * PhotoFolder.photos
   */
  export type PhotoFolder$photosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Photo
     */
    select?: PhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Photo
     */
    omit?: PhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoInclude<ExtArgs> | null
    where?: PhotoWhereInput
    orderBy?: PhotoOrderByWithRelationInput | PhotoOrderByWithRelationInput[]
    cursor?: PhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: PhotoScalarFieldEnum | PhotoScalarFieldEnum[]
  }

  /**
   * PhotoFolder without action
   */
  export type PhotoFolderDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the PhotoFolder
     */
    select?: PhotoFolderSelect<ExtArgs> | null
    /**
     * Omit specific fields from the PhotoFolder
     */
    omit?: PhotoFolderOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PhotoFolderInclude<ExtArgs> | null
  }


  /**
   * Model Portfolio
   */

  export type AggregatePortfolio = {
    _count: PortfolioCountAggregateOutputType | null
    _avg: PortfolioAvgAggregateOutputType | null
    _sum: PortfolioSumAggregateOutputType | null
    _min: PortfolioMinAggregateOutputType | null
    _max: PortfolioMaxAggregateOutputType | null
  }

  export type PortfolioAvgAggregateOutputType = {
    views: number | null
  }

  export type PortfolioSumAggregateOutputType = {
    views: number | null
  }

  export type PortfolioMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    slug: string | null
    status: string | null
    template: string | null
    customDomain: string | null
    views: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PortfolioMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    slug: string | null
    status: string | null
    template: string | null
    customDomain: string | null
    views: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type PortfolioCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    slug: number
    status: number
    template: number
    customDomain: number
    content: number
    views: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type PortfolioAvgAggregateInputType = {
    views?: true
  }

  export type PortfolioSumAggregateInputType = {
    views?: true
  }

  export type PortfolioMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    slug?: true
    status?: true
    template?: true
    customDomain?: true
    views?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PortfolioMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    slug?: true
    status?: true
    template?: true
    customDomain?: true
    views?: true
    createdAt?: true
    updatedAt?: true
  }

  export type PortfolioCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    slug?: true
    status?: true
    template?: true
    customDomain?: true
    content?: true
    views?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type PortfolioAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Portfolio to aggregate.
     */
    where?: PortfolioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Portfolios to fetch.
     */
    orderBy?: PortfolioOrderByWithRelationInput | PortfolioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: PortfolioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Portfolios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Portfolios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Portfolios
    **/
    _count?: true | PortfolioCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: PortfolioAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: PortfolioSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: PortfolioMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: PortfolioMaxAggregateInputType
  }

  export type GetPortfolioAggregateType<T extends PortfolioAggregateArgs> = {
        [P in keyof T & keyof AggregatePortfolio]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregatePortfolio[P]>
      : GetScalarType<T[P], AggregatePortfolio[P]>
  }




  export type PortfolioGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: PortfolioWhereInput
    orderBy?: PortfolioOrderByWithAggregationInput | PortfolioOrderByWithAggregationInput[]
    by: PortfolioScalarFieldEnum[] | PortfolioScalarFieldEnum
    having?: PortfolioScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: PortfolioCountAggregateInputType | true
    _avg?: PortfolioAvgAggregateInputType
    _sum?: PortfolioSumAggregateInputType
    _min?: PortfolioMinAggregateInputType
    _max?: PortfolioMaxAggregateInputType
  }

  export type PortfolioGroupByOutputType = {
    id: string
    userId: string
    title: string
    slug: string
    status: string
    template: string
    customDomain: string | null
    content: JsonValue
    views: number
    createdAt: Date
    updatedAt: Date
    _count: PortfolioCountAggregateOutputType | null
    _avg: PortfolioAvgAggregateOutputType | null
    _sum: PortfolioSumAggregateOutputType | null
    _min: PortfolioMinAggregateOutputType | null
    _max: PortfolioMaxAggregateOutputType | null
  }

  type GetPortfolioGroupByPayload<T extends PortfolioGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<PortfolioGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof PortfolioGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], PortfolioGroupByOutputType[P]>
            : GetScalarType<T[P], PortfolioGroupByOutputType[P]>
        }
      >
    >


  export type PortfolioSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    slug?: boolean
    status?: boolean
    template?: boolean
    customDomain?: boolean
    content?: boolean
    views?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["portfolio"]>

  export type PortfolioSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    slug?: boolean
    status?: boolean
    template?: boolean
    customDomain?: boolean
    content?: boolean
    views?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["portfolio"]>

  export type PortfolioSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    slug?: boolean
    status?: boolean
    template?: boolean
    customDomain?: boolean
    content?: boolean
    views?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["portfolio"]>

  export type PortfolioSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    slug?: boolean
    status?: boolean
    template?: boolean
    customDomain?: boolean
    content?: boolean
    views?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type PortfolioOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "slug" | "status" | "template" | "customDomain" | "content" | "views" | "createdAt" | "updatedAt", ExtArgs["result"]["portfolio"]>
  export type PortfolioInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PortfolioIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type PortfolioIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $PortfolioPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Portfolio"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      slug: string
      status: string
      template: string
      customDomain: string | null
      content: Prisma.JsonValue
      views: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["portfolio"]>
    composites: {}
  }

  type PortfolioGetPayload<S extends boolean | null | undefined | PortfolioDefaultArgs> = $Result.GetResult<Prisma.$PortfolioPayload, S>

  type PortfolioCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<PortfolioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: PortfolioCountAggregateInputType | true
    }

  export interface PortfolioDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Portfolio'], meta: { name: 'Portfolio' } }
    /**
     * Find zero or one Portfolio that matches the filter.
     * @param {PortfolioFindUniqueArgs} args - Arguments to find a Portfolio
     * @example
     * // Get one Portfolio
     * const portfolio = await prisma.portfolio.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends PortfolioFindUniqueArgs>(args: SelectSubset<T, PortfolioFindUniqueArgs<ExtArgs>>): Prisma__PortfolioClient<$Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Portfolio that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {PortfolioFindUniqueOrThrowArgs} args - Arguments to find a Portfolio
     * @example
     * // Get one Portfolio
     * const portfolio = await prisma.portfolio.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends PortfolioFindUniqueOrThrowArgs>(args: SelectSubset<T, PortfolioFindUniqueOrThrowArgs<ExtArgs>>): Prisma__PortfolioClient<$Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Portfolio that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PortfolioFindFirstArgs} args - Arguments to find a Portfolio
     * @example
     * // Get one Portfolio
     * const portfolio = await prisma.portfolio.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends PortfolioFindFirstArgs>(args?: SelectSubset<T, PortfolioFindFirstArgs<ExtArgs>>): Prisma__PortfolioClient<$Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Portfolio that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PortfolioFindFirstOrThrowArgs} args - Arguments to find a Portfolio
     * @example
     * // Get one Portfolio
     * const portfolio = await prisma.portfolio.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends PortfolioFindFirstOrThrowArgs>(args?: SelectSubset<T, PortfolioFindFirstOrThrowArgs<ExtArgs>>): Prisma__PortfolioClient<$Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Portfolios that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PortfolioFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Portfolios
     * const portfolios = await prisma.portfolio.findMany()
     * 
     * // Get first 10 Portfolios
     * const portfolios = await prisma.portfolio.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const portfolioWithIdOnly = await prisma.portfolio.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends PortfolioFindManyArgs>(args?: SelectSubset<T, PortfolioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Portfolio.
     * @param {PortfolioCreateArgs} args - Arguments to create a Portfolio.
     * @example
     * // Create one Portfolio
     * const Portfolio = await prisma.portfolio.create({
     *   data: {
     *     // ... data to create a Portfolio
     *   }
     * })
     * 
     */
    create<T extends PortfolioCreateArgs>(args: SelectSubset<T, PortfolioCreateArgs<ExtArgs>>): Prisma__PortfolioClient<$Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Portfolios.
     * @param {PortfolioCreateManyArgs} args - Arguments to create many Portfolios.
     * @example
     * // Create many Portfolios
     * const portfolio = await prisma.portfolio.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends PortfolioCreateManyArgs>(args?: SelectSubset<T, PortfolioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Portfolios and returns the data saved in the database.
     * @param {PortfolioCreateManyAndReturnArgs} args - Arguments to create many Portfolios.
     * @example
     * // Create many Portfolios
     * const portfolio = await prisma.portfolio.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Portfolios and only return the `id`
     * const portfolioWithIdOnly = await prisma.portfolio.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends PortfolioCreateManyAndReturnArgs>(args?: SelectSubset<T, PortfolioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Portfolio.
     * @param {PortfolioDeleteArgs} args - Arguments to delete one Portfolio.
     * @example
     * // Delete one Portfolio
     * const Portfolio = await prisma.portfolio.delete({
     *   where: {
     *     // ... filter to delete one Portfolio
     *   }
     * })
     * 
     */
    delete<T extends PortfolioDeleteArgs>(args: SelectSubset<T, PortfolioDeleteArgs<ExtArgs>>): Prisma__PortfolioClient<$Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Portfolio.
     * @param {PortfolioUpdateArgs} args - Arguments to update one Portfolio.
     * @example
     * // Update one Portfolio
     * const portfolio = await prisma.portfolio.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends PortfolioUpdateArgs>(args: SelectSubset<T, PortfolioUpdateArgs<ExtArgs>>): Prisma__PortfolioClient<$Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Portfolios.
     * @param {PortfolioDeleteManyArgs} args - Arguments to filter Portfolios to delete.
     * @example
     * // Delete a few Portfolios
     * const { count } = await prisma.portfolio.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends PortfolioDeleteManyArgs>(args?: SelectSubset<T, PortfolioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Portfolios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PortfolioUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Portfolios
     * const portfolio = await prisma.portfolio.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends PortfolioUpdateManyArgs>(args: SelectSubset<T, PortfolioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Portfolios and returns the data updated in the database.
     * @param {PortfolioUpdateManyAndReturnArgs} args - Arguments to update many Portfolios.
     * @example
     * // Update many Portfolios
     * const portfolio = await prisma.portfolio.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Portfolios and only return the `id`
     * const portfolioWithIdOnly = await prisma.portfolio.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends PortfolioUpdateManyAndReturnArgs>(args: SelectSubset<T, PortfolioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Portfolio.
     * @param {PortfolioUpsertArgs} args - Arguments to update or create a Portfolio.
     * @example
     * // Update or create a Portfolio
     * const portfolio = await prisma.portfolio.upsert({
     *   create: {
     *     // ... data to create a Portfolio
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Portfolio we want to update
     *   }
     * })
     */
    upsert<T extends PortfolioUpsertArgs>(args: SelectSubset<T, PortfolioUpsertArgs<ExtArgs>>): Prisma__PortfolioClient<$Result.GetResult<Prisma.$PortfolioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Portfolios.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PortfolioCountArgs} args - Arguments to filter Portfolios to count.
     * @example
     * // Count the number of Portfolios
     * const count = await prisma.portfolio.count({
     *   where: {
     *     // ... the filter for the Portfolios we want to count
     *   }
     * })
    **/
    count<T extends PortfolioCountArgs>(
      args?: Subset<T, PortfolioCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], PortfolioCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Portfolio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PortfolioAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends PortfolioAggregateArgs>(args: Subset<T, PortfolioAggregateArgs>): Prisma.PrismaPromise<GetPortfolioAggregateType<T>>

    /**
     * Group by Portfolio.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {PortfolioGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends PortfolioGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: PortfolioGroupByArgs['orderBy'] }
        : { orderBy?: PortfolioGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, PortfolioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPortfolioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Portfolio model
   */
  readonly fields: PortfolioFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Portfolio.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__PortfolioClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Portfolio model
   */
  interface PortfolioFieldRefs {
    readonly id: FieldRef<"Portfolio", 'String'>
    readonly userId: FieldRef<"Portfolio", 'String'>
    readonly title: FieldRef<"Portfolio", 'String'>
    readonly slug: FieldRef<"Portfolio", 'String'>
    readonly status: FieldRef<"Portfolio", 'String'>
    readonly template: FieldRef<"Portfolio", 'String'>
    readonly customDomain: FieldRef<"Portfolio", 'String'>
    readonly content: FieldRef<"Portfolio", 'Json'>
    readonly views: FieldRef<"Portfolio", 'Int'>
    readonly createdAt: FieldRef<"Portfolio", 'DateTime'>
    readonly updatedAt: FieldRef<"Portfolio", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Portfolio findUnique
   */
  export type PortfolioFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: PortfolioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: PortfolioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PortfolioInclude<ExtArgs> | null
    /**
     * Filter, which Portfolio to fetch.
     */
    where: PortfolioWhereUniqueInput
  }

  /**
   * Portfolio findUniqueOrThrow
   */
  export type PortfolioFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: PortfolioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: PortfolioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PortfolioInclude<ExtArgs> | null
    /**
     * Filter, which Portfolio to fetch.
     */
    where: PortfolioWhereUniqueInput
  }

  /**
   * Portfolio findFirst
   */
  export type PortfolioFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: PortfolioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: PortfolioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PortfolioInclude<ExtArgs> | null
    /**
     * Filter, which Portfolio to fetch.
     */
    where?: PortfolioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Portfolios to fetch.
     */
    orderBy?: PortfolioOrderByWithRelationInput | PortfolioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Portfolios.
     */
    cursor?: PortfolioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Portfolios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Portfolios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Portfolios.
     */
    distinct?: PortfolioScalarFieldEnum | PortfolioScalarFieldEnum[]
  }

  /**
   * Portfolio findFirstOrThrow
   */
  export type PortfolioFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: PortfolioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: PortfolioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PortfolioInclude<ExtArgs> | null
    /**
     * Filter, which Portfolio to fetch.
     */
    where?: PortfolioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Portfolios to fetch.
     */
    orderBy?: PortfolioOrderByWithRelationInput | PortfolioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Portfolios.
     */
    cursor?: PortfolioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Portfolios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Portfolios.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Portfolios.
     */
    distinct?: PortfolioScalarFieldEnum | PortfolioScalarFieldEnum[]
  }

  /**
   * Portfolio findMany
   */
  export type PortfolioFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: PortfolioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: PortfolioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PortfolioInclude<ExtArgs> | null
    /**
     * Filter, which Portfolios to fetch.
     */
    where?: PortfolioWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Portfolios to fetch.
     */
    orderBy?: PortfolioOrderByWithRelationInput | PortfolioOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Portfolios.
     */
    cursor?: PortfolioWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Portfolios from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Portfolios.
     */
    skip?: number
    distinct?: PortfolioScalarFieldEnum | PortfolioScalarFieldEnum[]
  }

  /**
   * Portfolio create
   */
  export type PortfolioCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: PortfolioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: PortfolioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PortfolioInclude<ExtArgs> | null
    /**
     * The data needed to create a Portfolio.
     */
    data: XOR<PortfolioCreateInput, PortfolioUncheckedCreateInput>
  }

  /**
   * Portfolio createMany
   */
  export type PortfolioCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Portfolios.
     */
    data: PortfolioCreateManyInput | PortfolioCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Portfolio createManyAndReturn
   */
  export type PortfolioCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: PortfolioSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: PortfolioOmit<ExtArgs> | null
    /**
     * The data used to create many Portfolios.
     */
    data: PortfolioCreateManyInput | PortfolioCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PortfolioIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Portfolio update
   */
  export type PortfolioUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: PortfolioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: PortfolioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PortfolioInclude<ExtArgs> | null
    /**
     * The data needed to update a Portfolio.
     */
    data: XOR<PortfolioUpdateInput, PortfolioUncheckedUpdateInput>
    /**
     * Choose, which Portfolio to update.
     */
    where: PortfolioWhereUniqueInput
  }

  /**
   * Portfolio updateMany
   */
  export type PortfolioUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Portfolios.
     */
    data: XOR<PortfolioUpdateManyMutationInput, PortfolioUncheckedUpdateManyInput>
    /**
     * Filter which Portfolios to update
     */
    where?: PortfolioWhereInput
    /**
     * Limit how many Portfolios to update.
     */
    limit?: number
  }

  /**
   * Portfolio updateManyAndReturn
   */
  export type PortfolioUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: PortfolioSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: PortfolioOmit<ExtArgs> | null
    /**
     * The data used to update Portfolios.
     */
    data: XOR<PortfolioUpdateManyMutationInput, PortfolioUncheckedUpdateManyInput>
    /**
     * Filter which Portfolios to update
     */
    where?: PortfolioWhereInput
    /**
     * Limit how many Portfolios to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PortfolioIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Portfolio upsert
   */
  export type PortfolioUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: PortfolioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: PortfolioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PortfolioInclude<ExtArgs> | null
    /**
     * The filter to search for the Portfolio to update in case it exists.
     */
    where: PortfolioWhereUniqueInput
    /**
     * In case the Portfolio found by the `where` argument doesn't exist, create a new Portfolio with this data.
     */
    create: XOR<PortfolioCreateInput, PortfolioUncheckedCreateInput>
    /**
     * In case the Portfolio was found with the provided `where` argument, update it with this data.
     */
    update: XOR<PortfolioUpdateInput, PortfolioUncheckedUpdateInput>
  }

  /**
   * Portfolio delete
   */
  export type PortfolioDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: PortfolioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: PortfolioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PortfolioInclude<ExtArgs> | null
    /**
     * Filter which Portfolio to delete.
     */
    where: PortfolioWhereUniqueInput
  }

  /**
   * Portfolio deleteMany
   */
  export type PortfolioDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Portfolios to delete
     */
    where?: PortfolioWhereInput
    /**
     * Limit how many Portfolios to delete.
     */
    limit?: number
  }

  /**
   * Portfolio without action
   */
  export type PortfolioDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Portfolio
     */
    select?: PortfolioSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Portfolio
     */
    omit?: PortfolioOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: PortfolioInclude<ExtArgs> | null
  }


  /**
   * Model LinksPage
   */

  export type AggregateLinksPage = {
    _count: LinksPageCountAggregateOutputType | null
    _avg: LinksPageAvgAggregateOutputType | null
    _sum: LinksPageSumAggregateOutputType | null
    _min: LinksPageMinAggregateOutputType | null
    _max: LinksPageMaxAggregateOutputType | null
  }

  export type LinksPageAvgAggregateOutputType = {
    bgGradAngle: number | null
    bgOverlayOpacity: number | null
  }

  export type LinksPageSumAggregateOutputType = {
    bgGradAngle: number | null
    bgOverlayOpacity: number | null
  }

  export type LinksPageMinAggregateOutputType = {
    id: string | null
    userId: string | null
    template: string | null
    displayName: string | null
    bio: string | null
    avatarUrl: string | null
    avatarBg: string | null
    avatarInitial: string | null
    bgType: string | null
    bgColor: string | null
    bgGradFrom: string | null
    bgGradTo: string | null
    bgGradAngle: number | null
    bgImageUrl: string | null
    bgOverlayColor: string | null
    bgOverlayOpacity: number | null
    btnShape: string | null
    btnVariant: string | null
    btnBg: string | null
    btnText: string | null
    btnBorder: string | null
    fontFamily: string | null
    fontWeight: string | null
    textColor: string | null
    subColor: string | null
    slug: string | null
    published: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LinksPageMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    template: string | null
    displayName: string | null
    bio: string | null
    avatarUrl: string | null
    avatarBg: string | null
    avatarInitial: string | null
    bgType: string | null
    bgColor: string | null
    bgGradFrom: string | null
    bgGradTo: string | null
    bgGradAngle: number | null
    bgImageUrl: string | null
    bgOverlayColor: string | null
    bgOverlayOpacity: number | null
    btnShape: string | null
    btnVariant: string | null
    btnBg: string | null
    btnText: string | null
    btnBorder: string | null
    fontFamily: string | null
    fontWeight: string | null
    textColor: string | null
    subColor: string | null
    slug: string | null
    published: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type LinksPageCountAggregateOutputType = {
    id: number
    userId: number
    template: number
    displayName: number
    bio: number
    avatarUrl: number
    avatarBg: number
    avatarInitial: number
    bgType: number
    bgColor: number
    bgGradFrom: number
    bgGradTo: number
    bgGradAngle: number
    bgImageUrl: number
    bgOverlayColor: number
    bgOverlayOpacity: number
    btnShape: number
    btnVariant: number
    btnBg: number
    btnText: number
    btnBorder: number
    fontFamily: number
    fontWeight: number
    textColor: number
    subColor: number
    labels: number
    slug: number
    published: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type LinksPageAvgAggregateInputType = {
    bgGradAngle?: true
    bgOverlayOpacity?: true
  }

  export type LinksPageSumAggregateInputType = {
    bgGradAngle?: true
    bgOverlayOpacity?: true
  }

  export type LinksPageMinAggregateInputType = {
    id?: true
    userId?: true
    template?: true
    displayName?: true
    bio?: true
    avatarUrl?: true
    avatarBg?: true
    avatarInitial?: true
    bgType?: true
    bgColor?: true
    bgGradFrom?: true
    bgGradTo?: true
    bgGradAngle?: true
    bgImageUrl?: true
    bgOverlayColor?: true
    bgOverlayOpacity?: true
    btnShape?: true
    btnVariant?: true
    btnBg?: true
    btnText?: true
    btnBorder?: true
    fontFamily?: true
    fontWeight?: true
    textColor?: true
    subColor?: true
    slug?: true
    published?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LinksPageMaxAggregateInputType = {
    id?: true
    userId?: true
    template?: true
    displayName?: true
    bio?: true
    avatarUrl?: true
    avatarBg?: true
    avatarInitial?: true
    bgType?: true
    bgColor?: true
    bgGradFrom?: true
    bgGradTo?: true
    bgGradAngle?: true
    bgImageUrl?: true
    bgOverlayColor?: true
    bgOverlayOpacity?: true
    btnShape?: true
    btnVariant?: true
    btnBg?: true
    btnText?: true
    btnBorder?: true
    fontFamily?: true
    fontWeight?: true
    textColor?: true
    subColor?: true
    slug?: true
    published?: true
    createdAt?: true
    updatedAt?: true
  }

  export type LinksPageCountAggregateInputType = {
    id?: true
    userId?: true
    template?: true
    displayName?: true
    bio?: true
    avatarUrl?: true
    avatarBg?: true
    avatarInitial?: true
    bgType?: true
    bgColor?: true
    bgGradFrom?: true
    bgGradTo?: true
    bgGradAngle?: true
    bgImageUrl?: true
    bgOverlayColor?: true
    bgOverlayOpacity?: true
    btnShape?: true
    btnVariant?: true
    btnBg?: true
    btnText?: true
    btnBorder?: true
    fontFamily?: true
    fontWeight?: true
    textColor?: true
    subColor?: true
    labels?: true
    slug?: true
    published?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type LinksPageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LinksPage to aggregate.
     */
    where?: LinksPageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinksPages to fetch.
     */
    orderBy?: LinksPageOrderByWithRelationInput | LinksPageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LinksPageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinksPages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinksPages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LinksPages
    **/
    _count?: true | LinksPageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LinksPageAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LinksPageSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LinksPageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LinksPageMaxAggregateInputType
  }

  export type GetLinksPageAggregateType<T extends LinksPageAggregateArgs> = {
        [P in keyof T & keyof AggregateLinksPage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLinksPage[P]>
      : GetScalarType<T[P], AggregateLinksPage[P]>
  }




  export type LinksPageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinksPageWhereInput
    orderBy?: LinksPageOrderByWithAggregationInput | LinksPageOrderByWithAggregationInput[]
    by: LinksPageScalarFieldEnum[] | LinksPageScalarFieldEnum
    having?: LinksPageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LinksPageCountAggregateInputType | true
    _avg?: LinksPageAvgAggregateInputType
    _sum?: LinksPageSumAggregateInputType
    _min?: LinksPageMinAggregateInputType
    _max?: LinksPageMaxAggregateInputType
  }

  export type LinksPageGroupByOutputType = {
    id: string
    userId: string
    template: string
    displayName: string
    bio: string
    avatarUrl: string
    avatarBg: string
    avatarInitial: string
    bgType: string
    bgColor: string
    bgGradFrom: string
    bgGradTo: string
    bgGradAngle: number
    bgImageUrl: string
    bgOverlayColor: string
    bgOverlayOpacity: number
    btnShape: string
    btnVariant: string
    btnBg: string
    btnText: string
    btnBorder: string
    fontFamily: string
    fontWeight: string
    textColor: string
    subColor: string
    labels: JsonValue
    slug: string | null
    published: boolean
    createdAt: Date
    updatedAt: Date
    _count: LinksPageCountAggregateOutputType | null
    _avg: LinksPageAvgAggregateOutputType | null
    _sum: LinksPageSumAggregateOutputType | null
    _min: LinksPageMinAggregateOutputType | null
    _max: LinksPageMaxAggregateOutputType | null
  }

  type GetLinksPageGroupByPayload<T extends LinksPageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LinksPageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LinksPageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LinksPageGroupByOutputType[P]>
            : GetScalarType<T[P], LinksPageGroupByOutputType[P]>
        }
      >
    >


  export type LinksPageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    template?: boolean
    displayName?: boolean
    bio?: boolean
    avatarUrl?: boolean
    avatarBg?: boolean
    avatarInitial?: boolean
    bgType?: boolean
    bgColor?: boolean
    bgGradFrom?: boolean
    bgGradTo?: boolean
    bgGradAngle?: boolean
    bgImageUrl?: boolean
    bgOverlayColor?: boolean
    bgOverlayOpacity?: boolean
    btnShape?: boolean
    btnVariant?: boolean
    btnBg?: boolean
    btnText?: boolean
    btnBorder?: boolean
    fontFamily?: boolean
    fontWeight?: boolean
    textColor?: boolean
    subColor?: boolean
    labels?: boolean
    slug?: boolean
    published?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    links?: boolean | LinksPage$linksArgs<ExtArgs>
    _count?: boolean | LinksPageCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["linksPage"]>

  export type LinksPageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    template?: boolean
    displayName?: boolean
    bio?: boolean
    avatarUrl?: boolean
    avatarBg?: boolean
    avatarInitial?: boolean
    bgType?: boolean
    bgColor?: boolean
    bgGradFrom?: boolean
    bgGradTo?: boolean
    bgGradAngle?: boolean
    bgImageUrl?: boolean
    bgOverlayColor?: boolean
    bgOverlayOpacity?: boolean
    btnShape?: boolean
    btnVariant?: boolean
    btnBg?: boolean
    btnText?: boolean
    btnBorder?: boolean
    fontFamily?: boolean
    fontWeight?: boolean
    textColor?: boolean
    subColor?: boolean
    labels?: boolean
    slug?: boolean
    published?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["linksPage"]>

  export type LinksPageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    template?: boolean
    displayName?: boolean
    bio?: boolean
    avatarUrl?: boolean
    avatarBg?: boolean
    avatarInitial?: boolean
    bgType?: boolean
    bgColor?: boolean
    bgGradFrom?: boolean
    bgGradTo?: boolean
    bgGradAngle?: boolean
    bgImageUrl?: boolean
    bgOverlayColor?: boolean
    bgOverlayOpacity?: boolean
    btnShape?: boolean
    btnVariant?: boolean
    btnBg?: boolean
    btnText?: boolean
    btnBorder?: boolean
    fontFamily?: boolean
    fontWeight?: boolean
    textColor?: boolean
    subColor?: boolean
    labels?: boolean
    slug?: boolean
    published?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["linksPage"]>

  export type LinksPageSelectScalar = {
    id?: boolean
    userId?: boolean
    template?: boolean
    displayName?: boolean
    bio?: boolean
    avatarUrl?: boolean
    avatarBg?: boolean
    avatarInitial?: boolean
    bgType?: boolean
    bgColor?: boolean
    bgGradFrom?: boolean
    bgGradTo?: boolean
    bgGradAngle?: boolean
    bgImageUrl?: boolean
    bgOverlayColor?: boolean
    bgOverlayOpacity?: boolean
    btnShape?: boolean
    btnVariant?: boolean
    btnBg?: boolean
    btnText?: boolean
    btnBorder?: boolean
    fontFamily?: boolean
    fontWeight?: boolean
    textColor?: boolean
    subColor?: boolean
    labels?: boolean
    slug?: boolean
    published?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type LinksPageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "template" | "displayName" | "bio" | "avatarUrl" | "avatarBg" | "avatarInitial" | "bgType" | "bgColor" | "bgGradFrom" | "bgGradTo" | "bgGradAngle" | "bgImageUrl" | "bgOverlayColor" | "bgOverlayOpacity" | "btnShape" | "btnVariant" | "btnBg" | "btnText" | "btnBorder" | "fontFamily" | "fontWeight" | "textColor" | "subColor" | "labels" | "slug" | "published" | "createdAt" | "updatedAt", ExtArgs["result"]["linksPage"]>
  export type LinksPageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    links?: boolean | LinksPage$linksArgs<ExtArgs>
    _count?: boolean | LinksPageCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LinksPageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type LinksPageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LinksPagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LinksPage"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      links: Prisma.$LinkItemPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      template: string
      displayName: string
      bio: string
      avatarUrl: string
      avatarBg: string
      avatarInitial: string
      bgType: string
      bgColor: string
      bgGradFrom: string
      bgGradTo: string
      bgGradAngle: number
      bgImageUrl: string
      bgOverlayColor: string
      bgOverlayOpacity: number
      btnShape: string
      btnVariant: string
      btnBg: string
      btnText: string
      btnBorder: string
      fontFamily: string
      fontWeight: string
      textColor: string
      subColor: string
      labels: Prisma.JsonValue
      slug: string | null
      published: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["linksPage"]>
    composites: {}
  }

  type LinksPageGetPayload<S extends boolean | null | undefined | LinksPageDefaultArgs> = $Result.GetResult<Prisma.$LinksPagePayload, S>

  type LinksPageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LinksPageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LinksPageCountAggregateInputType | true
    }

  export interface LinksPageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LinksPage'], meta: { name: 'LinksPage' } }
    /**
     * Find zero or one LinksPage that matches the filter.
     * @param {LinksPageFindUniqueArgs} args - Arguments to find a LinksPage
     * @example
     * // Get one LinksPage
     * const linksPage = await prisma.linksPage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LinksPageFindUniqueArgs>(args: SelectSubset<T, LinksPageFindUniqueArgs<ExtArgs>>): Prisma__LinksPageClient<$Result.GetResult<Prisma.$LinksPagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LinksPage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LinksPageFindUniqueOrThrowArgs} args - Arguments to find a LinksPage
     * @example
     * // Get one LinksPage
     * const linksPage = await prisma.linksPage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LinksPageFindUniqueOrThrowArgs>(args: SelectSubset<T, LinksPageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LinksPageClient<$Result.GetResult<Prisma.$LinksPagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LinksPage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinksPageFindFirstArgs} args - Arguments to find a LinksPage
     * @example
     * // Get one LinksPage
     * const linksPage = await prisma.linksPage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LinksPageFindFirstArgs>(args?: SelectSubset<T, LinksPageFindFirstArgs<ExtArgs>>): Prisma__LinksPageClient<$Result.GetResult<Prisma.$LinksPagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LinksPage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinksPageFindFirstOrThrowArgs} args - Arguments to find a LinksPage
     * @example
     * // Get one LinksPage
     * const linksPage = await prisma.linksPage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LinksPageFindFirstOrThrowArgs>(args?: SelectSubset<T, LinksPageFindFirstOrThrowArgs<ExtArgs>>): Prisma__LinksPageClient<$Result.GetResult<Prisma.$LinksPagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LinksPages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinksPageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LinksPages
     * const linksPages = await prisma.linksPage.findMany()
     * 
     * // Get first 10 LinksPages
     * const linksPages = await prisma.linksPage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const linksPageWithIdOnly = await prisma.linksPage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LinksPageFindManyArgs>(args?: SelectSubset<T, LinksPageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinksPagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LinksPage.
     * @param {LinksPageCreateArgs} args - Arguments to create a LinksPage.
     * @example
     * // Create one LinksPage
     * const LinksPage = await prisma.linksPage.create({
     *   data: {
     *     // ... data to create a LinksPage
     *   }
     * })
     * 
     */
    create<T extends LinksPageCreateArgs>(args: SelectSubset<T, LinksPageCreateArgs<ExtArgs>>): Prisma__LinksPageClient<$Result.GetResult<Prisma.$LinksPagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LinksPages.
     * @param {LinksPageCreateManyArgs} args - Arguments to create many LinksPages.
     * @example
     * // Create many LinksPages
     * const linksPage = await prisma.linksPage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LinksPageCreateManyArgs>(args?: SelectSubset<T, LinksPageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LinksPages and returns the data saved in the database.
     * @param {LinksPageCreateManyAndReturnArgs} args - Arguments to create many LinksPages.
     * @example
     * // Create many LinksPages
     * const linksPage = await prisma.linksPage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LinksPages and only return the `id`
     * const linksPageWithIdOnly = await prisma.linksPage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LinksPageCreateManyAndReturnArgs>(args?: SelectSubset<T, LinksPageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinksPagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LinksPage.
     * @param {LinksPageDeleteArgs} args - Arguments to delete one LinksPage.
     * @example
     * // Delete one LinksPage
     * const LinksPage = await prisma.linksPage.delete({
     *   where: {
     *     // ... filter to delete one LinksPage
     *   }
     * })
     * 
     */
    delete<T extends LinksPageDeleteArgs>(args: SelectSubset<T, LinksPageDeleteArgs<ExtArgs>>): Prisma__LinksPageClient<$Result.GetResult<Prisma.$LinksPagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LinksPage.
     * @param {LinksPageUpdateArgs} args - Arguments to update one LinksPage.
     * @example
     * // Update one LinksPage
     * const linksPage = await prisma.linksPage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LinksPageUpdateArgs>(args: SelectSubset<T, LinksPageUpdateArgs<ExtArgs>>): Prisma__LinksPageClient<$Result.GetResult<Prisma.$LinksPagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LinksPages.
     * @param {LinksPageDeleteManyArgs} args - Arguments to filter LinksPages to delete.
     * @example
     * // Delete a few LinksPages
     * const { count } = await prisma.linksPage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LinksPageDeleteManyArgs>(args?: SelectSubset<T, LinksPageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LinksPages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinksPageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LinksPages
     * const linksPage = await prisma.linksPage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LinksPageUpdateManyArgs>(args: SelectSubset<T, LinksPageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LinksPages and returns the data updated in the database.
     * @param {LinksPageUpdateManyAndReturnArgs} args - Arguments to update many LinksPages.
     * @example
     * // Update many LinksPages
     * const linksPage = await prisma.linksPage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LinksPages and only return the `id`
     * const linksPageWithIdOnly = await prisma.linksPage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LinksPageUpdateManyAndReturnArgs>(args: SelectSubset<T, LinksPageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinksPagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LinksPage.
     * @param {LinksPageUpsertArgs} args - Arguments to update or create a LinksPage.
     * @example
     * // Update or create a LinksPage
     * const linksPage = await prisma.linksPage.upsert({
     *   create: {
     *     // ... data to create a LinksPage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LinksPage we want to update
     *   }
     * })
     */
    upsert<T extends LinksPageUpsertArgs>(args: SelectSubset<T, LinksPageUpsertArgs<ExtArgs>>): Prisma__LinksPageClient<$Result.GetResult<Prisma.$LinksPagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LinksPages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinksPageCountArgs} args - Arguments to filter LinksPages to count.
     * @example
     * // Count the number of LinksPages
     * const count = await prisma.linksPage.count({
     *   where: {
     *     // ... the filter for the LinksPages we want to count
     *   }
     * })
    **/
    count<T extends LinksPageCountArgs>(
      args?: Subset<T, LinksPageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LinksPageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LinksPage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinksPageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LinksPageAggregateArgs>(args: Subset<T, LinksPageAggregateArgs>): Prisma.PrismaPromise<GetLinksPageAggregateType<T>>

    /**
     * Group by LinksPage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinksPageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LinksPageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LinksPageGroupByArgs['orderBy'] }
        : { orderBy?: LinksPageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LinksPageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLinksPageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LinksPage model
   */
  readonly fields: LinksPageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LinksPage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LinksPageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    links<T extends LinksPage$linksArgs<ExtArgs> = {}>(args?: Subset<T, LinksPage$linksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LinksPage model
   */
  interface LinksPageFieldRefs {
    readonly id: FieldRef<"LinksPage", 'String'>
    readonly userId: FieldRef<"LinksPage", 'String'>
    readonly template: FieldRef<"LinksPage", 'String'>
    readonly displayName: FieldRef<"LinksPage", 'String'>
    readonly bio: FieldRef<"LinksPage", 'String'>
    readonly avatarUrl: FieldRef<"LinksPage", 'String'>
    readonly avatarBg: FieldRef<"LinksPage", 'String'>
    readonly avatarInitial: FieldRef<"LinksPage", 'String'>
    readonly bgType: FieldRef<"LinksPage", 'String'>
    readonly bgColor: FieldRef<"LinksPage", 'String'>
    readonly bgGradFrom: FieldRef<"LinksPage", 'String'>
    readonly bgGradTo: FieldRef<"LinksPage", 'String'>
    readonly bgGradAngle: FieldRef<"LinksPage", 'Int'>
    readonly bgImageUrl: FieldRef<"LinksPage", 'String'>
    readonly bgOverlayColor: FieldRef<"LinksPage", 'String'>
    readonly bgOverlayOpacity: FieldRef<"LinksPage", 'Float'>
    readonly btnShape: FieldRef<"LinksPage", 'String'>
    readonly btnVariant: FieldRef<"LinksPage", 'String'>
    readonly btnBg: FieldRef<"LinksPage", 'String'>
    readonly btnText: FieldRef<"LinksPage", 'String'>
    readonly btnBorder: FieldRef<"LinksPage", 'String'>
    readonly fontFamily: FieldRef<"LinksPage", 'String'>
    readonly fontWeight: FieldRef<"LinksPage", 'String'>
    readonly textColor: FieldRef<"LinksPage", 'String'>
    readonly subColor: FieldRef<"LinksPage", 'String'>
    readonly labels: FieldRef<"LinksPage", 'Json'>
    readonly slug: FieldRef<"LinksPage", 'String'>
    readonly published: FieldRef<"LinksPage", 'Boolean'>
    readonly createdAt: FieldRef<"LinksPage", 'DateTime'>
    readonly updatedAt: FieldRef<"LinksPage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LinksPage findUnique
   */
  export type LinksPageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPage
     */
    select?: LinksPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinksPage
     */
    omit?: LinksPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinksPageInclude<ExtArgs> | null
    /**
     * Filter, which LinksPage to fetch.
     */
    where: LinksPageWhereUniqueInput
  }

  /**
   * LinksPage findUniqueOrThrow
   */
  export type LinksPageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPage
     */
    select?: LinksPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinksPage
     */
    omit?: LinksPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinksPageInclude<ExtArgs> | null
    /**
     * Filter, which LinksPage to fetch.
     */
    where: LinksPageWhereUniqueInput
  }

  /**
   * LinksPage findFirst
   */
  export type LinksPageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPage
     */
    select?: LinksPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinksPage
     */
    omit?: LinksPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinksPageInclude<ExtArgs> | null
    /**
     * Filter, which LinksPage to fetch.
     */
    where?: LinksPageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinksPages to fetch.
     */
    orderBy?: LinksPageOrderByWithRelationInput | LinksPageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LinksPages.
     */
    cursor?: LinksPageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinksPages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinksPages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LinksPages.
     */
    distinct?: LinksPageScalarFieldEnum | LinksPageScalarFieldEnum[]
  }

  /**
   * LinksPage findFirstOrThrow
   */
  export type LinksPageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPage
     */
    select?: LinksPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinksPage
     */
    omit?: LinksPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinksPageInclude<ExtArgs> | null
    /**
     * Filter, which LinksPage to fetch.
     */
    where?: LinksPageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinksPages to fetch.
     */
    orderBy?: LinksPageOrderByWithRelationInput | LinksPageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LinksPages.
     */
    cursor?: LinksPageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinksPages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinksPages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LinksPages.
     */
    distinct?: LinksPageScalarFieldEnum | LinksPageScalarFieldEnum[]
  }

  /**
   * LinksPage findMany
   */
  export type LinksPageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPage
     */
    select?: LinksPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinksPage
     */
    omit?: LinksPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinksPageInclude<ExtArgs> | null
    /**
     * Filter, which LinksPages to fetch.
     */
    where?: LinksPageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinksPages to fetch.
     */
    orderBy?: LinksPageOrderByWithRelationInput | LinksPageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LinksPages.
     */
    cursor?: LinksPageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinksPages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinksPages.
     */
    skip?: number
    distinct?: LinksPageScalarFieldEnum | LinksPageScalarFieldEnum[]
  }

  /**
   * LinksPage create
   */
  export type LinksPageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPage
     */
    select?: LinksPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinksPage
     */
    omit?: LinksPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinksPageInclude<ExtArgs> | null
    /**
     * The data needed to create a LinksPage.
     */
    data: XOR<LinksPageCreateInput, LinksPageUncheckedCreateInput>
  }

  /**
   * LinksPage createMany
   */
  export type LinksPageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LinksPages.
     */
    data: LinksPageCreateManyInput | LinksPageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LinksPage createManyAndReturn
   */
  export type LinksPageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPage
     */
    select?: LinksPageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LinksPage
     */
    omit?: LinksPageOmit<ExtArgs> | null
    /**
     * The data used to create many LinksPages.
     */
    data: LinksPageCreateManyInput | LinksPageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinksPageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LinksPage update
   */
  export type LinksPageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPage
     */
    select?: LinksPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinksPage
     */
    omit?: LinksPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinksPageInclude<ExtArgs> | null
    /**
     * The data needed to update a LinksPage.
     */
    data: XOR<LinksPageUpdateInput, LinksPageUncheckedUpdateInput>
    /**
     * Choose, which LinksPage to update.
     */
    where: LinksPageWhereUniqueInput
  }

  /**
   * LinksPage updateMany
   */
  export type LinksPageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LinksPages.
     */
    data: XOR<LinksPageUpdateManyMutationInput, LinksPageUncheckedUpdateManyInput>
    /**
     * Filter which LinksPages to update
     */
    where?: LinksPageWhereInput
    /**
     * Limit how many LinksPages to update.
     */
    limit?: number
  }

  /**
   * LinksPage updateManyAndReturn
   */
  export type LinksPageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPage
     */
    select?: LinksPageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LinksPage
     */
    omit?: LinksPageOmit<ExtArgs> | null
    /**
     * The data used to update LinksPages.
     */
    data: XOR<LinksPageUpdateManyMutationInput, LinksPageUncheckedUpdateManyInput>
    /**
     * Filter which LinksPages to update
     */
    where?: LinksPageWhereInput
    /**
     * Limit how many LinksPages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinksPageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LinksPage upsert
   */
  export type LinksPageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPage
     */
    select?: LinksPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinksPage
     */
    omit?: LinksPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinksPageInclude<ExtArgs> | null
    /**
     * The filter to search for the LinksPage to update in case it exists.
     */
    where: LinksPageWhereUniqueInput
    /**
     * In case the LinksPage found by the `where` argument doesn't exist, create a new LinksPage with this data.
     */
    create: XOR<LinksPageCreateInput, LinksPageUncheckedCreateInput>
    /**
     * In case the LinksPage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LinksPageUpdateInput, LinksPageUncheckedUpdateInput>
  }

  /**
   * LinksPage delete
   */
  export type LinksPageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPage
     */
    select?: LinksPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinksPage
     */
    omit?: LinksPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinksPageInclude<ExtArgs> | null
    /**
     * Filter which LinksPage to delete.
     */
    where: LinksPageWhereUniqueInput
  }

  /**
   * LinksPage deleteMany
   */
  export type LinksPageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LinksPages to delete
     */
    where?: LinksPageWhereInput
    /**
     * Limit how many LinksPages to delete.
     */
    limit?: number
  }

  /**
   * LinksPage.links
   */
  export type LinksPage$linksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkItem
     */
    select?: LinkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkItem
     */
    omit?: LinkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkItemInclude<ExtArgs> | null
    where?: LinkItemWhereInput
    orderBy?: LinkItemOrderByWithRelationInput | LinkItemOrderByWithRelationInput[]
    cursor?: LinkItemWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LinkItemScalarFieldEnum | LinkItemScalarFieldEnum[]
  }

  /**
   * LinksPage without action
   */
  export type LinksPageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinksPage
     */
    select?: LinksPageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinksPage
     */
    omit?: LinksPageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinksPageInclude<ExtArgs> | null
  }


  /**
   * Model LinkItem
   */

  export type AggregateLinkItem = {
    _count: LinkItemCountAggregateOutputType | null
    _avg: LinkItemAvgAggregateOutputType | null
    _sum: LinkItemSumAggregateOutputType | null
    _min: LinkItemMinAggregateOutputType | null
    _max: LinkItemMaxAggregateOutputType | null
  }

  export type LinkItemAvgAggregateOutputType = {
    order: number | null
  }

  export type LinkItemSumAggregateOutputType = {
    order: number | null
  }

  export type LinkItemMinAggregateOutputType = {
    id: string | null
    linksPageId: string | null
    type: string | null
    title: string | null
    url: string | null
    enabled: boolean | null
    order: number | null
    icon: string | null
    waCountry: string | null
    waPhone: string | null
    waMessage: string | null
    igUsername: string | null
    emailAddress: string | null
    emailSubject: string | null
    createdAt: Date | null
  }

  export type LinkItemMaxAggregateOutputType = {
    id: string | null
    linksPageId: string | null
    type: string | null
    title: string | null
    url: string | null
    enabled: boolean | null
    order: number | null
    icon: string | null
    waCountry: string | null
    waPhone: string | null
    waMessage: string | null
    igUsername: string | null
    emailAddress: string | null
    emailSubject: string | null
    createdAt: Date | null
  }

  export type LinkItemCountAggregateOutputType = {
    id: number
    linksPageId: number
    type: number
    title: number
    url: number
    enabled: number
    order: number
    icon: number
    waCountry: number
    waPhone: number
    waMessage: number
    igUsername: number
    emailAddress: number
    emailSubject: number
    createdAt: number
    _all: number
  }


  export type LinkItemAvgAggregateInputType = {
    order?: true
  }

  export type LinkItemSumAggregateInputType = {
    order?: true
  }

  export type LinkItemMinAggregateInputType = {
    id?: true
    linksPageId?: true
    type?: true
    title?: true
    url?: true
    enabled?: true
    order?: true
    icon?: true
    waCountry?: true
    waPhone?: true
    waMessage?: true
    igUsername?: true
    emailAddress?: true
    emailSubject?: true
    createdAt?: true
  }

  export type LinkItemMaxAggregateInputType = {
    id?: true
    linksPageId?: true
    type?: true
    title?: true
    url?: true
    enabled?: true
    order?: true
    icon?: true
    waCountry?: true
    waPhone?: true
    waMessage?: true
    igUsername?: true
    emailAddress?: true
    emailSubject?: true
    createdAt?: true
  }

  export type LinkItemCountAggregateInputType = {
    id?: true
    linksPageId?: true
    type?: true
    title?: true
    url?: true
    enabled?: true
    order?: true
    icon?: true
    waCountry?: true
    waPhone?: true
    waMessage?: true
    igUsername?: true
    emailAddress?: true
    emailSubject?: true
    createdAt?: true
    _all?: true
  }

  export type LinkItemAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LinkItem to aggregate.
     */
    where?: LinkItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkItems to fetch.
     */
    orderBy?: LinkItemOrderByWithRelationInput | LinkItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LinkItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LinkItems
    **/
    _count?: true | LinkItemCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LinkItemAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LinkItemSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LinkItemMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LinkItemMaxAggregateInputType
  }

  export type GetLinkItemAggregateType<T extends LinkItemAggregateArgs> = {
        [P in keyof T & keyof AggregateLinkItem]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLinkItem[P]>
      : GetScalarType<T[P], AggregateLinkItem[P]>
  }




  export type LinkItemGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LinkItemWhereInput
    orderBy?: LinkItemOrderByWithAggregationInput | LinkItemOrderByWithAggregationInput[]
    by: LinkItemScalarFieldEnum[] | LinkItemScalarFieldEnum
    having?: LinkItemScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LinkItemCountAggregateInputType | true
    _avg?: LinkItemAvgAggregateInputType
    _sum?: LinkItemSumAggregateInputType
    _min?: LinkItemMinAggregateInputType
    _max?: LinkItemMaxAggregateInputType
  }

  export type LinkItemGroupByOutputType = {
    id: string
    linksPageId: string
    type: string
    title: string
    url: string
    enabled: boolean
    order: number
    icon: string
    waCountry: string | null
    waPhone: string | null
    waMessage: string | null
    igUsername: string | null
    emailAddress: string | null
    emailSubject: string | null
    createdAt: Date
    _count: LinkItemCountAggregateOutputType | null
    _avg: LinkItemAvgAggregateOutputType | null
    _sum: LinkItemSumAggregateOutputType | null
    _min: LinkItemMinAggregateOutputType | null
    _max: LinkItemMaxAggregateOutputType | null
  }

  type GetLinkItemGroupByPayload<T extends LinkItemGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LinkItemGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LinkItemGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LinkItemGroupByOutputType[P]>
            : GetScalarType<T[P], LinkItemGroupByOutputType[P]>
        }
      >
    >


  export type LinkItemSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    linksPageId?: boolean
    type?: boolean
    title?: boolean
    url?: boolean
    enabled?: boolean
    order?: boolean
    icon?: boolean
    waCountry?: boolean
    waPhone?: boolean
    waMessage?: boolean
    igUsername?: boolean
    emailAddress?: boolean
    emailSubject?: boolean
    createdAt?: boolean
    linksPage?: boolean | LinksPageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["linkItem"]>

  export type LinkItemSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    linksPageId?: boolean
    type?: boolean
    title?: boolean
    url?: boolean
    enabled?: boolean
    order?: boolean
    icon?: boolean
    waCountry?: boolean
    waPhone?: boolean
    waMessage?: boolean
    igUsername?: boolean
    emailAddress?: boolean
    emailSubject?: boolean
    createdAt?: boolean
    linksPage?: boolean | LinksPageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["linkItem"]>

  export type LinkItemSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    linksPageId?: boolean
    type?: boolean
    title?: boolean
    url?: boolean
    enabled?: boolean
    order?: boolean
    icon?: boolean
    waCountry?: boolean
    waPhone?: boolean
    waMessage?: boolean
    igUsername?: boolean
    emailAddress?: boolean
    emailSubject?: boolean
    createdAt?: boolean
    linksPage?: boolean | LinksPageDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["linkItem"]>

  export type LinkItemSelectScalar = {
    id?: boolean
    linksPageId?: boolean
    type?: boolean
    title?: boolean
    url?: boolean
    enabled?: boolean
    order?: boolean
    icon?: boolean
    waCountry?: boolean
    waPhone?: boolean
    waMessage?: boolean
    igUsername?: boolean
    emailAddress?: boolean
    emailSubject?: boolean
    createdAt?: boolean
  }

  export type LinkItemOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "linksPageId" | "type" | "title" | "url" | "enabled" | "order" | "icon" | "waCountry" | "waPhone" | "waMessage" | "igUsername" | "emailAddress" | "emailSubject" | "createdAt", ExtArgs["result"]["linkItem"]>
  export type LinkItemInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    linksPage?: boolean | LinksPageDefaultArgs<ExtArgs>
  }
  export type LinkItemIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    linksPage?: boolean | LinksPageDefaultArgs<ExtArgs>
  }
  export type LinkItemIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    linksPage?: boolean | LinksPageDefaultArgs<ExtArgs>
  }

  export type $LinkItemPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LinkItem"
    objects: {
      linksPage: Prisma.$LinksPagePayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      linksPageId: string
      type: string
      title: string
      url: string
      enabled: boolean
      order: number
      icon: string
      waCountry: string | null
      waPhone: string | null
      waMessage: string | null
      igUsername: string | null
      emailAddress: string | null
      emailSubject: string | null
      createdAt: Date
    }, ExtArgs["result"]["linkItem"]>
    composites: {}
  }

  type LinkItemGetPayload<S extends boolean | null | undefined | LinkItemDefaultArgs> = $Result.GetResult<Prisma.$LinkItemPayload, S>

  type LinkItemCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LinkItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LinkItemCountAggregateInputType | true
    }

  export interface LinkItemDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LinkItem'], meta: { name: 'LinkItem' } }
    /**
     * Find zero or one LinkItem that matches the filter.
     * @param {LinkItemFindUniqueArgs} args - Arguments to find a LinkItem
     * @example
     * // Get one LinkItem
     * const linkItem = await prisma.linkItem.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LinkItemFindUniqueArgs>(args: SelectSubset<T, LinkItemFindUniqueArgs<ExtArgs>>): Prisma__LinkItemClient<$Result.GetResult<Prisma.$LinkItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LinkItem that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LinkItemFindUniqueOrThrowArgs} args - Arguments to find a LinkItem
     * @example
     * // Get one LinkItem
     * const linkItem = await prisma.linkItem.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LinkItemFindUniqueOrThrowArgs>(args: SelectSubset<T, LinkItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LinkItemClient<$Result.GetResult<Prisma.$LinkItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LinkItem that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkItemFindFirstArgs} args - Arguments to find a LinkItem
     * @example
     * // Get one LinkItem
     * const linkItem = await prisma.linkItem.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LinkItemFindFirstArgs>(args?: SelectSubset<T, LinkItemFindFirstArgs<ExtArgs>>): Prisma__LinkItemClient<$Result.GetResult<Prisma.$LinkItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LinkItem that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkItemFindFirstOrThrowArgs} args - Arguments to find a LinkItem
     * @example
     * // Get one LinkItem
     * const linkItem = await prisma.linkItem.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LinkItemFindFirstOrThrowArgs>(args?: SelectSubset<T, LinkItemFindFirstOrThrowArgs<ExtArgs>>): Prisma__LinkItemClient<$Result.GetResult<Prisma.$LinkItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LinkItems that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkItemFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LinkItems
     * const linkItems = await prisma.linkItem.findMany()
     * 
     * // Get first 10 LinkItems
     * const linkItems = await prisma.linkItem.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const linkItemWithIdOnly = await prisma.linkItem.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LinkItemFindManyArgs>(args?: SelectSubset<T, LinkItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LinkItem.
     * @param {LinkItemCreateArgs} args - Arguments to create a LinkItem.
     * @example
     * // Create one LinkItem
     * const LinkItem = await prisma.linkItem.create({
     *   data: {
     *     // ... data to create a LinkItem
     *   }
     * })
     * 
     */
    create<T extends LinkItemCreateArgs>(args: SelectSubset<T, LinkItemCreateArgs<ExtArgs>>): Prisma__LinkItemClient<$Result.GetResult<Prisma.$LinkItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LinkItems.
     * @param {LinkItemCreateManyArgs} args - Arguments to create many LinkItems.
     * @example
     * // Create many LinkItems
     * const linkItem = await prisma.linkItem.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LinkItemCreateManyArgs>(args?: SelectSubset<T, LinkItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LinkItems and returns the data saved in the database.
     * @param {LinkItemCreateManyAndReturnArgs} args - Arguments to create many LinkItems.
     * @example
     * // Create many LinkItems
     * const linkItem = await prisma.linkItem.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LinkItems and only return the `id`
     * const linkItemWithIdOnly = await prisma.linkItem.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LinkItemCreateManyAndReturnArgs>(args?: SelectSubset<T, LinkItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LinkItem.
     * @param {LinkItemDeleteArgs} args - Arguments to delete one LinkItem.
     * @example
     * // Delete one LinkItem
     * const LinkItem = await prisma.linkItem.delete({
     *   where: {
     *     // ... filter to delete one LinkItem
     *   }
     * })
     * 
     */
    delete<T extends LinkItemDeleteArgs>(args: SelectSubset<T, LinkItemDeleteArgs<ExtArgs>>): Prisma__LinkItemClient<$Result.GetResult<Prisma.$LinkItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LinkItem.
     * @param {LinkItemUpdateArgs} args - Arguments to update one LinkItem.
     * @example
     * // Update one LinkItem
     * const linkItem = await prisma.linkItem.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LinkItemUpdateArgs>(args: SelectSubset<T, LinkItemUpdateArgs<ExtArgs>>): Prisma__LinkItemClient<$Result.GetResult<Prisma.$LinkItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LinkItems.
     * @param {LinkItemDeleteManyArgs} args - Arguments to filter LinkItems to delete.
     * @example
     * // Delete a few LinkItems
     * const { count } = await prisma.linkItem.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LinkItemDeleteManyArgs>(args?: SelectSubset<T, LinkItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LinkItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkItemUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LinkItems
     * const linkItem = await prisma.linkItem.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LinkItemUpdateManyArgs>(args: SelectSubset<T, LinkItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LinkItems and returns the data updated in the database.
     * @param {LinkItemUpdateManyAndReturnArgs} args - Arguments to update many LinkItems.
     * @example
     * // Update many LinkItems
     * const linkItem = await prisma.linkItem.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LinkItems and only return the `id`
     * const linkItemWithIdOnly = await prisma.linkItem.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LinkItemUpdateManyAndReturnArgs>(args: SelectSubset<T, LinkItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LinkItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LinkItem.
     * @param {LinkItemUpsertArgs} args - Arguments to update or create a LinkItem.
     * @example
     * // Update or create a LinkItem
     * const linkItem = await prisma.linkItem.upsert({
     *   create: {
     *     // ... data to create a LinkItem
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LinkItem we want to update
     *   }
     * })
     */
    upsert<T extends LinkItemUpsertArgs>(args: SelectSubset<T, LinkItemUpsertArgs<ExtArgs>>): Prisma__LinkItemClient<$Result.GetResult<Prisma.$LinkItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LinkItems.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkItemCountArgs} args - Arguments to filter LinkItems to count.
     * @example
     * // Count the number of LinkItems
     * const count = await prisma.linkItem.count({
     *   where: {
     *     // ... the filter for the LinkItems we want to count
     *   }
     * })
    **/
    count<T extends LinkItemCountArgs>(
      args?: Subset<T, LinkItemCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LinkItemCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LinkItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkItemAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LinkItemAggregateArgs>(args: Subset<T, LinkItemAggregateArgs>): Prisma.PrismaPromise<GetLinkItemAggregateType<T>>

    /**
     * Group by LinkItem.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LinkItemGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LinkItemGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LinkItemGroupByArgs['orderBy'] }
        : { orderBy?: LinkItemGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LinkItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLinkItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LinkItem model
   */
  readonly fields: LinkItemFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LinkItem.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LinkItemClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    linksPage<T extends LinksPageDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LinksPageDefaultArgs<ExtArgs>>): Prisma__LinksPageClient<$Result.GetResult<Prisma.$LinksPagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LinkItem model
   */
  interface LinkItemFieldRefs {
    readonly id: FieldRef<"LinkItem", 'String'>
    readonly linksPageId: FieldRef<"LinkItem", 'String'>
    readonly type: FieldRef<"LinkItem", 'String'>
    readonly title: FieldRef<"LinkItem", 'String'>
    readonly url: FieldRef<"LinkItem", 'String'>
    readonly enabled: FieldRef<"LinkItem", 'Boolean'>
    readonly order: FieldRef<"LinkItem", 'Int'>
    readonly icon: FieldRef<"LinkItem", 'String'>
    readonly waCountry: FieldRef<"LinkItem", 'String'>
    readonly waPhone: FieldRef<"LinkItem", 'String'>
    readonly waMessage: FieldRef<"LinkItem", 'String'>
    readonly igUsername: FieldRef<"LinkItem", 'String'>
    readonly emailAddress: FieldRef<"LinkItem", 'String'>
    readonly emailSubject: FieldRef<"LinkItem", 'String'>
    readonly createdAt: FieldRef<"LinkItem", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LinkItem findUnique
   */
  export type LinkItemFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkItem
     */
    select?: LinkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkItem
     */
    omit?: LinkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkItemInclude<ExtArgs> | null
    /**
     * Filter, which LinkItem to fetch.
     */
    where: LinkItemWhereUniqueInput
  }

  /**
   * LinkItem findUniqueOrThrow
   */
  export type LinkItemFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkItem
     */
    select?: LinkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkItem
     */
    omit?: LinkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkItemInclude<ExtArgs> | null
    /**
     * Filter, which LinkItem to fetch.
     */
    where: LinkItemWhereUniqueInput
  }

  /**
   * LinkItem findFirst
   */
  export type LinkItemFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkItem
     */
    select?: LinkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkItem
     */
    omit?: LinkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkItemInclude<ExtArgs> | null
    /**
     * Filter, which LinkItem to fetch.
     */
    where?: LinkItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkItems to fetch.
     */
    orderBy?: LinkItemOrderByWithRelationInput | LinkItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LinkItems.
     */
    cursor?: LinkItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LinkItems.
     */
    distinct?: LinkItemScalarFieldEnum | LinkItemScalarFieldEnum[]
  }

  /**
   * LinkItem findFirstOrThrow
   */
  export type LinkItemFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkItem
     */
    select?: LinkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkItem
     */
    omit?: LinkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkItemInclude<ExtArgs> | null
    /**
     * Filter, which LinkItem to fetch.
     */
    where?: LinkItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkItems to fetch.
     */
    orderBy?: LinkItemOrderByWithRelationInput | LinkItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LinkItems.
     */
    cursor?: LinkItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkItems.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LinkItems.
     */
    distinct?: LinkItemScalarFieldEnum | LinkItemScalarFieldEnum[]
  }

  /**
   * LinkItem findMany
   */
  export type LinkItemFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkItem
     */
    select?: LinkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkItem
     */
    omit?: LinkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkItemInclude<ExtArgs> | null
    /**
     * Filter, which LinkItems to fetch.
     */
    where?: LinkItemWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LinkItems to fetch.
     */
    orderBy?: LinkItemOrderByWithRelationInput | LinkItemOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LinkItems.
     */
    cursor?: LinkItemWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LinkItems from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LinkItems.
     */
    skip?: number
    distinct?: LinkItemScalarFieldEnum | LinkItemScalarFieldEnum[]
  }

  /**
   * LinkItem create
   */
  export type LinkItemCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkItem
     */
    select?: LinkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkItem
     */
    omit?: LinkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkItemInclude<ExtArgs> | null
    /**
     * The data needed to create a LinkItem.
     */
    data: XOR<LinkItemCreateInput, LinkItemUncheckedCreateInput>
  }

  /**
   * LinkItem createMany
   */
  export type LinkItemCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LinkItems.
     */
    data: LinkItemCreateManyInput | LinkItemCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LinkItem createManyAndReturn
   */
  export type LinkItemCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkItem
     */
    select?: LinkItemSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LinkItem
     */
    omit?: LinkItemOmit<ExtArgs> | null
    /**
     * The data used to create many LinkItems.
     */
    data: LinkItemCreateManyInput | LinkItemCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkItemIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LinkItem update
   */
  export type LinkItemUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkItem
     */
    select?: LinkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkItem
     */
    omit?: LinkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkItemInclude<ExtArgs> | null
    /**
     * The data needed to update a LinkItem.
     */
    data: XOR<LinkItemUpdateInput, LinkItemUncheckedUpdateInput>
    /**
     * Choose, which LinkItem to update.
     */
    where: LinkItemWhereUniqueInput
  }

  /**
   * LinkItem updateMany
   */
  export type LinkItemUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LinkItems.
     */
    data: XOR<LinkItemUpdateManyMutationInput, LinkItemUncheckedUpdateManyInput>
    /**
     * Filter which LinkItems to update
     */
    where?: LinkItemWhereInput
    /**
     * Limit how many LinkItems to update.
     */
    limit?: number
  }

  /**
   * LinkItem updateManyAndReturn
   */
  export type LinkItemUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkItem
     */
    select?: LinkItemSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LinkItem
     */
    omit?: LinkItemOmit<ExtArgs> | null
    /**
     * The data used to update LinkItems.
     */
    data: XOR<LinkItemUpdateManyMutationInput, LinkItemUncheckedUpdateManyInput>
    /**
     * Filter which LinkItems to update
     */
    where?: LinkItemWhereInput
    /**
     * Limit how many LinkItems to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkItemIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LinkItem upsert
   */
  export type LinkItemUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkItem
     */
    select?: LinkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkItem
     */
    omit?: LinkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkItemInclude<ExtArgs> | null
    /**
     * The filter to search for the LinkItem to update in case it exists.
     */
    where: LinkItemWhereUniqueInput
    /**
     * In case the LinkItem found by the `where` argument doesn't exist, create a new LinkItem with this data.
     */
    create: XOR<LinkItemCreateInput, LinkItemUncheckedCreateInput>
    /**
     * In case the LinkItem was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LinkItemUpdateInput, LinkItemUncheckedUpdateInput>
  }

  /**
   * LinkItem delete
   */
  export type LinkItemDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkItem
     */
    select?: LinkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkItem
     */
    omit?: LinkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkItemInclude<ExtArgs> | null
    /**
     * Filter which LinkItem to delete.
     */
    where: LinkItemWhereUniqueInput
  }

  /**
   * LinkItem deleteMany
   */
  export type LinkItemDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LinkItems to delete
     */
    where?: LinkItemWhereInput
    /**
     * Limit how many LinkItems to delete.
     */
    limit?: number
  }

  /**
   * LinkItem without action
   */
  export type LinkItemDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LinkItem
     */
    select?: LinkItemSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LinkItem
     */
    omit?: LinkItemOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LinkItemInclude<ExtArgs> | null
  }


  /**
   * Model Delivery
   */

  export type AggregateDelivery = {
    _count: DeliveryCountAggregateOutputType | null
    _avg: DeliveryAvgAggregateOutputType | null
    _sum: DeliverySumAggregateOutputType | null
    _min: DeliveryMinAggregateOutputType | null
    _max: DeliveryMaxAggregateOutputType | null
  }

  export type DeliveryAvgAggregateOutputType = {
    coverPositionX: number | null
    coverPositionY: number | null
    pricePerPhoto: number | null
    priceFullGallery: number | null
    logoWidth: number | null
    views: number | null
  }

  export type DeliverySumAggregateOutputType = {
    coverPositionX: number | null
    coverPositionY: number | null
    pricePerPhoto: number | null
    priceFullGallery: number | null
    logoWidth: number | null
    views: number | null
  }

  export type DeliveryMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    client: string | null
    status: string | null
    template: string | null
    layout: string | null
    coverUrl: string | null
    coverFit: string | null
    coverPositionX: number | null
    coverPositionY: number | null
    passwordEnabled: boolean | null
    password: string | null
    whitelistEnabled: boolean | null
    passwordTitle: string | null
    passwordSubtitle: string | null
    passwordHint: string | null
    passwordButtonLabel: string | null
    mode: string | null
    pricePerPhoto: number | null
    priceFullGallery: number | null
    downloadRes: string | null
    logoMode: string | null
    logoText: string | null
    logoUrl: string | null
    logoWidth: number | null
    customColors: boolean | null
    colorBg: string | null
    colorFg: string | null
    colorAccent: string | null
    colorBtnBg: string | null
    colorBtnFg: string | null
    fontFamily: string | null
    fontFamily1: string | null
    fontFamily2: string | null
    fontFamily3: string | null
    welcomeMessage: string | null
    showUpsellBanner: boolean | null
    slug: string | null
    views: number | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeliveryMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    client: string | null
    status: string | null
    template: string | null
    layout: string | null
    coverUrl: string | null
    coverFit: string | null
    coverPositionX: number | null
    coverPositionY: number | null
    passwordEnabled: boolean | null
    password: string | null
    whitelistEnabled: boolean | null
    passwordTitle: string | null
    passwordSubtitle: string | null
    passwordHint: string | null
    passwordButtonLabel: string | null
    mode: string | null
    pricePerPhoto: number | null
    priceFullGallery: number | null
    downloadRes: string | null
    logoMode: string | null
    logoText: string | null
    logoUrl: string | null
    logoWidth: number | null
    customColors: boolean | null
    colorBg: string | null
    colorFg: string | null
    colorAccent: string | null
    colorBtnBg: string | null
    colorBtnFg: string | null
    fontFamily: string | null
    fontFamily1: string | null
    fontFamily2: string | null
    fontFamily3: string | null
    welcomeMessage: string | null
    showUpsellBanner: boolean | null
    slug: string | null
    views: number | null
    expiresAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DeliveryCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    client: number
    status: number
    template: number
    layout: number
    coverUrl: number
    coverFit: number
    coverPositionX: number
    coverPositionY: number
    passwordEnabled: number
    password: number
    whitelistEnabled: number
    whitelist: number
    passwordTitle: number
    passwordSubtitle: number
    passwordHint: number
    passwordButtonLabel: number
    mode: number
    pricePerPhoto: number
    priceFullGallery: number
    downloadRes: number
    logoMode: number
    logoText: number
    logoUrl: number
    logoWidth: number
    customColors: number
    colorBg: number
    colorFg: number
    colorAccent: number
    colorBtnBg: number
    colorBtnFg: number
    fontFamily: number
    fontFamily1: number
    fontFamily2: number
    fontFamily3: number
    welcomeMessage: number
    showUpsellBanner: number
    labels: number
    slug: number
    views: number
    expiresAt: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DeliveryAvgAggregateInputType = {
    coverPositionX?: true
    coverPositionY?: true
    pricePerPhoto?: true
    priceFullGallery?: true
    logoWidth?: true
    views?: true
  }

  export type DeliverySumAggregateInputType = {
    coverPositionX?: true
    coverPositionY?: true
    pricePerPhoto?: true
    priceFullGallery?: true
    logoWidth?: true
    views?: true
  }

  export type DeliveryMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    client?: true
    status?: true
    template?: true
    layout?: true
    coverUrl?: true
    coverFit?: true
    coverPositionX?: true
    coverPositionY?: true
    passwordEnabled?: true
    password?: true
    whitelistEnabled?: true
    passwordTitle?: true
    passwordSubtitle?: true
    passwordHint?: true
    passwordButtonLabel?: true
    mode?: true
    pricePerPhoto?: true
    priceFullGallery?: true
    downloadRes?: true
    logoMode?: true
    logoText?: true
    logoUrl?: true
    logoWidth?: true
    customColors?: true
    colorBg?: true
    colorFg?: true
    colorAccent?: true
    colorBtnBg?: true
    colorBtnFg?: true
    fontFamily?: true
    fontFamily1?: true
    fontFamily2?: true
    fontFamily3?: true
    welcomeMessage?: true
    showUpsellBanner?: true
    slug?: true
    views?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeliveryMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    client?: true
    status?: true
    template?: true
    layout?: true
    coverUrl?: true
    coverFit?: true
    coverPositionX?: true
    coverPositionY?: true
    passwordEnabled?: true
    password?: true
    whitelistEnabled?: true
    passwordTitle?: true
    passwordSubtitle?: true
    passwordHint?: true
    passwordButtonLabel?: true
    mode?: true
    pricePerPhoto?: true
    priceFullGallery?: true
    downloadRes?: true
    logoMode?: true
    logoText?: true
    logoUrl?: true
    logoWidth?: true
    customColors?: true
    colorBg?: true
    colorFg?: true
    colorAccent?: true
    colorBtnBg?: true
    colorBtnFg?: true
    fontFamily?: true
    fontFamily1?: true
    fontFamily2?: true
    fontFamily3?: true
    welcomeMessage?: true
    showUpsellBanner?: true
    slug?: true
    views?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DeliveryCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    client?: true
    status?: true
    template?: true
    layout?: true
    coverUrl?: true
    coverFit?: true
    coverPositionX?: true
    coverPositionY?: true
    passwordEnabled?: true
    password?: true
    whitelistEnabled?: true
    whitelist?: true
    passwordTitle?: true
    passwordSubtitle?: true
    passwordHint?: true
    passwordButtonLabel?: true
    mode?: true
    pricePerPhoto?: true
    priceFullGallery?: true
    downloadRes?: true
    logoMode?: true
    logoText?: true
    logoUrl?: true
    logoWidth?: true
    customColors?: true
    colorBg?: true
    colorFg?: true
    colorAccent?: true
    colorBtnBg?: true
    colorBtnFg?: true
    fontFamily?: true
    fontFamily1?: true
    fontFamily2?: true
    fontFamily3?: true
    welcomeMessage?: true
    showUpsellBanner?: true
    labels?: true
    slug?: true
    views?: true
    expiresAt?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DeliveryAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Delivery to aggregate.
     */
    where?: DeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deliveries to fetch.
     */
    orderBy?: DeliveryOrderByWithRelationInput | DeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Deliveries
    **/
    _count?: true | DeliveryCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DeliveryAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DeliverySumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeliveryMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeliveryMaxAggregateInputType
  }

  export type GetDeliveryAggregateType<T extends DeliveryAggregateArgs> = {
        [P in keyof T & keyof AggregateDelivery]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDelivery[P]>
      : GetScalarType<T[P], AggregateDelivery[P]>
  }




  export type DeliveryGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeliveryWhereInput
    orderBy?: DeliveryOrderByWithAggregationInput | DeliveryOrderByWithAggregationInput[]
    by: DeliveryScalarFieldEnum[] | DeliveryScalarFieldEnum
    having?: DeliveryScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeliveryCountAggregateInputType | true
    _avg?: DeliveryAvgAggregateInputType
    _sum?: DeliverySumAggregateInputType
    _min?: DeliveryMinAggregateInputType
    _max?: DeliveryMaxAggregateInputType
  }

  export type DeliveryGroupByOutputType = {
    id: string
    userId: string
    title: string
    client: string
    status: string
    template: string
    layout: string
    coverUrl: string
    coverFit: string
    coverPositionX: number
    coverPositionY: number
    passwordEnabled: boolean
    password: string
    whitelistEnabled: boolean
    whitelist: string[]
    passwordTitle: string
    passwordSubtitle: string
    passwordHint: string
    passwordButtonLabel: string
    mode: string
    pricePerPhoto: number
    priceFullGallery: number
    downloadRes: string
    logoMode: string
    logoText: string
    logoUrl: string
    logoWidth: number
    customColors: boolean
    colorBg: string
    colorFg: string
    colorAccent: string
    colorBtnBg: string
    colorBtnFg: string
    fontFamily: string
    fontFamily1: string
    fontFamily2: string
    fontFamily3: string
    welcomeMessage: string
    showUpsellBanner: boolean
    labels: JsonValue
    slug: string | null
    views: number
    expiresAt: Date | null
    createdAt: Date
    updatedAt: Date
    _count: DeliveryCountAggregateOutputType | null
    _avg: DeliveryAvgAggregateOutputType | null
    _sum: DeliverySumAggregateOutputType | null
    _min: DeliveryMinAggregateOutputType | null
    _max: DeliveryMaxAggregateOutputType | null
  }

  type GetDeliveryGroupByPayload<T extends DeliveryGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeliveryGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeliveryGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeliveryGroupByOutputType[P]>
            : GetScalarType<T[P], DeliveryGroupByOutputType[P]>
        }
      >
    >


  export type DeliverySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    client?: boolean
    status?: boolean
    template?: boolean
    layout?: boolean
    coverUrl?: boolean
    coverFit?: boolean
    coverPositionX?: boolean
    coverPositionY?: boolean
    passwordEnabled?: boolean
    password?: boolean
    whitelistEnabled?: boolean
    whitelist?: boolean
    passwordTitle?: boolean
    passwordSubtitle?: boolean
    passwordHint?: boolean
    passwordButtonLabel?: boolean
    mode?: boolean
    pricePerPhoto?: boolean
    priceFullGallery?: boolean
    downloadRes?: boolean
    logoMode?: boolean
    logoText?: boolean
    logoUrl?: boolean
    logoWidth?: boolean
    customColors?: boolean
    colorBg?: boolean
    colorFg?: boolean
    colorAccent?: boolean
    colorBtnBg?: boolean
    colorBtnFg?: boolean
    fontFamily?: boolean
    fontFamily1?: boolean
    fontFamily2?: boolean
    fontFamily3?: boolean
    welcomeMessage?: boolean
    showUpsellBanner?: boolean
    labels?: boolean
    slug?: boolean
    views?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    photos?: boolean | Delivery$photosArgs<ExtArgs>
    _count?: boolean | DeliveryCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["delivery"]>

  export type DeliverySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    client?: boolean
    status?: boolean
    template?: boolean
    layout?: boolean
    coverUrl?: boolean
    coverFit?: boolean
    coverPositionX?: boolean
    coverPositionY?: boolean
    passwordEnabled?: boolean
    password?: boolean
    whitelistEnabled?: boolean
    whitelist?: boolean
    passwordTitle?: boolean
    passwordSubtitle?: boolean
    passwordHint?: boolean
    passwordButtonLabel?: boolean
    mode?: boolean
    pricePerPhoto?: boolean
    priceFullGallery?: boolean
    downloadRes?: boolean
    logoMode?: boolean
    logoText?: boolean
    logoUrl?: boolean
    logoWidth?: boolean
    customColors?: boolean
    colorBg?: boolean
    colorFg?: boolean
    colorAccent?: boolean
    colorBtnBg?: boolean
    colorBtnFg?: boolean
    fontFamily?: boolean
    fontFamily1?: boolean
    fontFamily2?: boolean
    fontFamily3?: boolean
    welcomeMessage?: boolean
    showUpsellBanner?: boolean
    labels?: boolean
    slug?: boolean
    views?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["delivery"]>

  export type DeliverySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    client?: boolean
    status?: boolean
    template?: boolean
    layout?: boolean
    coverUrl?: boolean
    coverFit?: boolean
    coverPositionX?: boolean
    coverPositionY?: boolean
    passwordEnabled?: boolean
    password?: boolean
    whitelistEnabled?: boolean
    whitelist?: boolean
    passwordTitle?: boolean
    passwordSubtitle?: boolean
    passwordHint?: boolean
    passwordButtonLabel?: boolean
    mode?: boolean
    pricePerPhoto?: boolean
    priceFullGallery?: boolean
    downloadRes?: boolean
    logoMode?: boolean
    logoText?: boolean
    logoUrl?: boolean
    logoWidth?: boolean
    customColors?: boolean
    colorBg?: boolean
    colorFg?: boolean
    colorAccent?: boolean
    colorBtnBg?: boolean
    colorBtnFg?: boolean
    fontFamily?: boolean
    fontFamily1?: boolean
    fontFamily2?: boolean
    fontFamily3?: boolean
    welcomeMessage?: boolean
    showUpsellBanner?: boolean
    labels?: boolean
    slug?: boolean
    views?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["delivery"]>

  export type DeliverySelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    client?: boolean
    status?: boolean
    template?: boolean
    layout?: boolean
    coverUrl?: boolean
    coverFit?: boolean
    coverPositionX?: boolean
    coverPositionY?: boolean
    passwordEnabled?: boolean
    password?: boolean
    whitelistEnabled?: boolean
    whitelist?: boolean
    passwordTitle?: boolean
    passwordSubtitle?: boolean
    passwordHint?: boolean
    passwordButtonLabel?: boolean
    mode?: boolean
    pricePerPhoto?: boolean
    priceFullGallery?: boolean
    downloadRes?: boolean
    logoMode?: boolean
    logoText?: boolean
    logoUrl?: boolean
    logoWidth?: boolean
    customColors?: boolean
    colorBg?: boolean
    colorFg?: boolean
    colorAccent?: boolean
    colorBtnBg?: boolean
    colorBtnFg?: boolean
    fontFamily?: boolean
    fontFamily1?: boolean
    fontFamily2?: boolean
    fontFamily3?: boolean
    welcomeMessage?: boolean
    showUpsellBanner?: boolean
    labels?: boolean
    slug?: boolean
    views?: boolean
    expiresAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DeliveryOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "userId" | "title" | "client" | "status" | "template" | "layout" | "coverUrl" | "coverFit" | "coverPositionX" | "coverPositionY" | "passwordEnabled" | "password" | "whitelistEnabled" | "whitelist" | "passwordTitle" | "passwordSubtitle" | "passwordHint" | "passwordButtonLabel" | "mode" | "pricePerPhoto" | "priceFullGallery" | "downloadRes" | "logoMode" | "logoText" | "logoUrl" | "logoWidth" | "customColors" | "colorBg" | "colorFg" | "colorAccent" | "colorBtnBg" | "colorBtnFg" | "fontFamily" | "fontFamily1" | "fontFamily2" | "fontFamily3" | "welcomeMessage" | "showUpsellBanner" | "labels" | "slug" | "views" | "expiresAt" | "createdAt" | "updatedAt", ExtArgs["result"]["delivery"]>
  export type DeliveryInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    photos?: boolean | Delivery$photosArgs<ExtArgs>
    _count?: boolean | DeliveryCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type DeliveryIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }
  export type DeliveryIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $DeliveryPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Delivery"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      photos: Prisma.$DeliveryPhotoPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      client: string
      status: string
      template: string
      layout: string
      coverUrl: string
      coverFit: string
      coverPositionX: number
      coverPositionY: number
      passwordEnabled: boolean
      password: string
      whitelistEnabled: boolean
      whitelist: string[]
      passwordTitle: string
      passwordSubtitle: string
      passwordHint: string
      passwordButtonLabel: string
      mode: string
      pricePerPhoto: number
      priceFullGallery: number
      downloadRes: string
      logoMode: string
      logoText: string
      logoUrl: string
      logoWidth: number
      customColors: boolean
      colorBg: string
      colorFg: string
      colorAccent: string
      colorBtnBg: string
      colorBtnFg: string
      fontFamily: string
      fontFamily1: string
      fontFamily2: string
      fontFamily3: string
      welcomeMessage: string
      showUpsellBanner: boolean
      labels: Prisma.JsonValue
      slug: string | null
      views: number
      expiresAt: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["delivery"]>
    composites: {}
  }

  type DeliveryGetPayload<S extends boolean | null | undefined | DeliveryDefaultArgs> = $Result.GetResult<Prisma.$DeliveryPayload, S>

  type DeliveryCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeliveryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeliveryCountAggregateInputType | true
    }

  export interface DeliveryDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Delivery'], meta: { name: 'Delivery' } }
    /**
     * Find zero or one Delivery that matches the filter.
     * @param {DeliveryFindUniqueArgs} args - Arguments to find a Delivery
     * @example
     * // Get one Delivery
     * const delivery = await prisma.delivery.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeliveryFindUniqueArgs>(args: SelectSubset<T, DeliveryFindUniqueArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Delivery that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeliveryFindUniqueOrThrowArgs} args - Arguments to find a Delivery
     * @example
     * // Get one Delivery
     * const delivery = await prisma.delivery.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeliveryFindUniqueOrThrowArgs>(args: SelectSubset<T, DeliveryFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Delivery that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryFindFirstArgs} args - Arguments to find a Delivery
     * @example
     * // Get one Delivery
     * const delivery = await prisma.delivery.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeliveryFindFirstArgs>(args?: SelectSubset<T, DeliveryFindFirstArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Delivery that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryFindFirstOrThrowArgs} args - Arguments to find a Delivery
     * @example
     * // Get one Delivery
     * const delivery = await prisma.delivery.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeliveryFindFirstOrThrowArgs>(args?: SelectSubset<T, DeliveryFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Deliveries that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Deliveries
     * const deliveries = await prisma.delivery.findMany()
     * 
     * // Get first 10 Deliveries
     * const deliveries = await prisma.delivery.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deliveryWithIdOnly = await prisma.delivery.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeliveryFindManyArgs>(args?: SelectSubset<T, DeliveryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Delivery.
     * @param {DeliveryCreateArgs} args - Arguments to create a Delivery.
     * @example
     * // Create one Delivery
     * const Delivery = await prisma.delivery.create({
     *   data: {
     *     // ... data to create a Delivery
     *   }
     * })
     * 
     */
    create<T extends DeliveryCreateArgs>(args: SelectSubset<T, DeliveryCreateArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Deliveries.
     * @param {DeliveryCreateManyArgs} args - Arguments to create many Deliveries.
     * @example
     * // Create many Deliveries
     * const delivery = await prisma.delivery.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeliveryCreateManyArgs>(args?: SelectSubset<T, DeliveryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Deliveries and returns the data saved in the database.
     * @param {DeliveryCreateManyAndReturnArgs} args - Arguments to create many Deliveries.
     * @example
     * // Create many Deliveries
     * const delivery = await prisma.delivery.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Deliveries and only return the `id`
     * const deliveryWithIdOnly = await prisma.delivery.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeliveryCreateManyAndReturnArgs>(args?: SelectSubset<T, DeliveryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Delivery.
     * @param {DeliveryDeleteArgs} args - Arguments to delete one Delivery.
     * @example
     * // Delete one Delivery
     * const Delivery = await prisma.delivery.delete({
     *   where: {
     *     // ... filter to delete one Delivery
     *   }
     * })
     * 
     */
    delete<T extends DeliveryDeleteArgs>(args: SelectSubset<T, DeliveryDeleteArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Delivery.
     * @param {DeliveryUpdateArgs} args - Arguments to update one Delivery.
     * @example
     * // Update one Delivery
     * const delivery = await prisma.delivery.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeliveryUpdateArgs>(args: SelectSubset<T, DeliveryUpdateArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Deliveries.
     * @param {DeliveryDeleteManyArgs} args - Arguments to filter Deliveries to delete.
     * @example
     * // Delete a few Deliveries
     * const { count } = await prisma.delivery.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeliveryDeleteManyArgs>(args?: SelectSubset<T, DeliveryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Deliveries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Deliveries
     * const delivery = await prisma.delivery.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeliveryUpdateManyArgs>(args: SelectSubset<T, DeliveryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Deliveries and returns the data updated in the database.
     * @param {DeliveryUpdateManyAndReturnArgs} args - Arguments to update many Deliveries.
     * @example
     * // Update many Deliveries
     * const delivery = await prisma.delivery.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Deliveries and only return the `id`
     * const deliveryWithIdOnly = await prisma.delivery.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DeliveryUpdateManyAndReturnArgs>(args: SelectSubset<T, DeliveryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Delivery.
     * @param {DeliveryUpsertArgs} args - Arguments to update or create a Delivery.
     * @example
     * // Update or create a Delivery
     * const delivery = await prisma.delivery.upsert({
     *   create: {
     *     // ... data to create a Delivery
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Delivery we want to update
     *   }
     * })
     */
    upsert<T extends DeliveryUpsertArgs>(args: SelectSubset<T, DeliveryUpsertArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Deliveries.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryCountArgs} args - Arguments to filter Deliveries to count.
     * @example
     * // Count the number of Deliveries
     * const count = await prisma.delivery.count({
     *   where: {
     *     // ... the filter for the Deliveries we want to count
     *   }
     * })
    **/
    count<T extends DeliveryCountArgs>(
      args?: Subset<T, DeliveryCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeliveryCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Delivery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeliveryAggregateArgs>(args: Subset<T, DeliveryAggregateArgs>): Prisma.PrismaPromise<GetDeliveryAggregateType<T>>

    /**
     * Group by Delivery.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeliveryGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeliveryGroupByArgs['orderBy'] }
        : { orderBy?: DeliveryGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeliveryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeliveryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Delivery model
   */
  readonly fields: DeliveryFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Delivery.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeliveryClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    photos<T extends Delivery$photosArgs<ExtArgs> = {}>(args?: Subset<T, Delivery$photosArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliveryPhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Delivery model
   */
  interface DeliveryFieldRefs {
    readonly id: FieldRef<"Delivery", 'String'>
    readonly userId: FieldRef<"Delivery", 'String'>
    readonly title: FieldRef<"Delivery", 'String'>
    readonly client: FieldRef<"Delivery", 'String'>
    readonly status: FieldRef<"Delivery", 'String'>
    readonly template: FieldRef<"Delivery", 'String'>
    readonly layout: FieldRef<"Delivery", 'String'>
    readonly coverUrl: FieldRef<"Delivery", 'String'>
    readonly coverFit: FieldRef<"Delivery", 'String'>
    readonly coverPositionX: FieldRef<"Delivery", 'Float'>
    readonly coverPositionY: FieldRef<"Delivery", 'Float'>
    readonly passwordEnabled: FieldRef<"Delivery", 'Boolean'>
    readonly password: FieldRef<"Delivery", 'String'>
    readonly whitelistEnabled: FieldRef<"Delivery", 'Boolean'>
    readonly whitelist: FieldRef<"Delivery", 'String[]'>
    readonly passwordTitle: FieldRef<"Delivery", 'String'>
    readonly passwordSubtitle: FieldRef<"Delivery", 'String'>
    readonly passwordHint: FieldRef<"Delivery", 'String'>
    readonly passwordButtonLabel: FieldRef<"Delivery", 'String'>
    readonly mode: FieldRef<"Delivery", 'String'>
    readonly pricePerPhoto: FieldRef<"Delivery", 'Float'>
    readonly priceFullGallery: FieldRef<"Delivery", 'Float'>
    readonly downloadRes: FieldRef<"Delivery", 'String'>
    readonly logoMode: FieldRef<"Delivery", 'String'>
    readonly logoText: FieldRef<"Delivery", 'String'>
    readonly logoUrl: FieldRef<"Delivery", 'String'>
    readonly logoWidth: FieldRef<"Delivery", 'Int'>
    readonly customColors: FieldRef<"Delivery", 'Boolean'>
    readonly colorBg: FieldRef<"Delivery", 'String'>
    readonly colorFg: FieldRef<"Delivery", 'String'>
    readonly colorAccent: FieldRef<"Delivery", 'String'>
    readonly colorBtnBg: FieldRef<"Delivery", 'String'>
    readonly colorBtnFg: FieldRef<"Delivery", 'String'>
    readonly fontFamily: FieldRef<"Delivery", 'String'>
    readonly fontFamily1: FieldRef<"Delivery", 'String'>
    readonly fontFamily2: FieldRef<"Delivery", 'String'>
    readonly fontFamily3: FieldRef<"Delivery", 'String'>
    readonly welcomeMessage: FieldRef<"Delivery", 'String'>
    readonly showUpsellBanner: FieldRef<"Delivery", 'Boolean'>
    readonly labels: FieldRef<"Delivery", 'Json'>
    readonly slug: FieldRef<"Delivery", 'String'>
    readonly views: FieldRef<"Delivery", 'Int'>
    readonly expiresAt: FieldRef<"Delivery", 'DateTime'>
    readonly createdAt: FieldRef<"Delivery", 'DateTime'>
    readonly updatedAt: FieldRef<"Delivery", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Delivery findUnique
   */
  export type DeliveryFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Delivery
     */
    omit?: DeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Delivery to fetch.
     */
    where: DeliveryWhereUniqueInput
  }

  /**
   * Delivery findUniqueOrThrow
   */
  export type DeliveryFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Delivery
     */
    omit?: DeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Delivery to fetch.
     */
    where: DeliveryWhereUniqueInput
  }

  /**
   * Delivery findFirst
   */
  export type DeliveryFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Delivery
     */
    omit?: DeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Delivery to fetch.
     */
    where?: DeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deliveries to fetch.
     */
    orderBy?: DeliveryOrderByWithRelationInput | DeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Deliveries.
     */
    cursor?: DeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Deliveries.
     */
    distinct?: DeliveryScalarFieldEnum | DeliveryScalarFieldEnum[]
  }

  /**
   * Delivery findFirstOrThrow
   */
  export type DeliveryFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Delivery
     */
    omit?: DeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Delivery to fetch.
     */
    where?: DeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deliveries to fetch.
     */
    orderBy?: DeliveryOrderByWithRelationInput | DeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Deliveries.
     */
    cursor?: DeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deliveries.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Deliveries.
     */
    distinct?: DeliveryScalarFieldEnum | DeliveryScalarFieldEnum[]
  }

  /**
   * Delivery findMany
   */
  export type DeliveryFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Delivery
     */
    omit?: DeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * Filter, which Deliveries to fetch.
     */
    where?: DeliveryWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Deliveries to fetch.
     */
    orderBy?: DeliveryOrderByWithRelationInput | DeliveryOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Deliveries.
     */
    cursor?: DeliveryWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Deliveries from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Deliveries.
     */
    skip?: number
    distinct?: DeliveryScalarFieldEnum | DeliveryScalarFieldEnum[]
  }

  /**
   * Delivery create
   */
  export type DeliveryCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Delivery
     */
    omit?: DeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * The data needed to create a Delivery.
     */
    data: XOR<DeliveryCreateInput, DeliveryUncheckedCreateInput>
  }

  /**
   * Delivery createMany
   */
  export type DeliveryCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Deliveries.
     */
    data: DeliveryCreateManyInput | DeliveryCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Delivery createManyAndReturn
   */
  export type DeliveryCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Delivery
     */
    omit?: DeliveryOmit<ExtArgs> | null
    /**
     * The data used to create many Deliveries.
     */
    data: DeliveryCreateManyInput | DeliveryCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Delivery update
   */
  export type DeliveryUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Delivery
     */
    omit?: DeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * The data needed to update a Delivery.
     */
    data: XOR<DeliveryUpdateInput, DeliveryUncheckedUpdateInput>
    /**
     * Choose, which Delivery to update.
     */
    where: DeliveryWhereUniqueInput
  }

  /**
   * Delivery updateMany
   */
  export type DeliveryUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Deliveries.
     */
    data: XOR<DeliveryUpdateManyMutationInput, DeliveryUncheckedUpdateManyInput>
    /**
     * Filter which Deliveries to update
     */
    where?: DeliveryWhereInput
    /**
     * Limit how many Deliveries to update.
     */
    limit?: number
  }

  /**
   * Delivery updateManyAndReturn
   */
  export type DeliveryUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Delivery
     */
    omit?: DeliveryOmit<ExtArgs> | null
    /**
     * The data used to update Deliveries.
     */
    data: XOR<DeliveryUpdateManyMutationInput, DeliveryUncheckedUpdateManyInput>
    /**
     * Filter which Deliveries to update
     */
    where?: DeliveryWhereInput
    /**
     * Limit how many Deliveries to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Delivery upsert
   */
  export type DeliveryUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Delivery
     */
    omit?: DeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * The filter to search for the Delivery to update in case it exists.
     */
    where: DeliveryWhereUniqueInput
    /**
     * In case the Delivery found by the `where` argument doesn't exist, create a new Delivery with this data.
     */
    create: XOR<DeliveryCreateInput, DeliveryUncheckedCreateInput>
    /**
     * In case the Delivery was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeliveryUpdateInput, DeliveryUncheckedUpdateInput>
  }

  /**
   * Delivery delete
   */
  export type DeliveryDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Delivery
     */
    omit?: DeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
    /**
     * Filter which Delivery to delete.
     */
    where: DeliveryWhereUniqueInput
  }

  /**
   * Delivery deleteMany
   */
  export type DeliveryDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Deliveries to delete
     */
    where?: DeliveryWhereInput
    /**
     * Limit how many Deliveries to delete.
     */
    limit?: number
  }

  /**
   * Delivery.photos
   */
  export type Delivery$photosArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoInclude<ExtArgs> | null
    where?: DeliveryPhotoWhereInput
    orderBy?: DeliveryPhotoOrderByWithRelationInput | DeliveryPhotoOrderByWithRelationInput[]
    cursor?: DeliveryPhotoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DeliveryPhotoScalarFieldEnum | DeliveryPhotoScalarFieldEnum[]
  }

  /**
   * Delivery without action
   */
  export type DeliveryDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Delivery
     */
    select?: DeliverySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Delivery
     */
    omit?: DeliveryOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryInclude<ExtArgs> | null
  }


  /**
   * Model DeliveryPhoto
   */

  export type AggregateDeliveryPhoto = {
    _count: DeliveryPhotoCountAggregateOutputType | null
    _avg: DeliveryPhotoAvgAggregateOutputType | null
    _sum: DeliveryPhotoSumAggregateOutputType | null
    _min: DeliveryPhotoMinAggregateOutputType | null
    _max: DeliveryPhotoMaxAggregateOutputType | null
  }

  export type DeliveryPhotoAvgAggregateOutputType = {
    order: number | null
  }

  export type DeliveryPhotoSumAggregateOutputType = {
    order: number | null
  }

  export type DeliveryPhotoMinAggregateOutputType = {
    id: string | null
    deliveryId: string | null
    photoId: string | null
    order: number | null
  }

  export type DeliveryPhotoMaxAggregateOutputType = {
    id: string | null
    deliveryId: string | null
    photoId: string | null
    order: number | null
  }

  export type DeliveryPhotoCountAggregateOutputType = {
    id: number
    deliveryId: number
    photoId: number
    order: number
    _all: number
  }


  export type DeliveryPhotoAvgAggregateInputType = {
    order?: true
  }

  export type DeliveryPhotoSumAggregateInputType = {
    order?: true
  }

  export type DeliveryPhotoMinAggregateInputType = {
    id?: true
    deliveryId?: true
    photoId?: true
    order?: true
  }

  export type DeliveryPhotoMaxAggregateInputType = {
    id?: true
    deliveryId?: true
    photoId?: true
    order?: true
  }

  export type DeliveryPhotoCountAggregateInputType = {
    id?: true
    deliveryId?: true
    photoId?: true
    order?: true
    _all?: true
  }

  export type DeliveryPhotoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeliveryPhoto to aggregate.
     */
    where?: DeliveryPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeliveryPhotos to fetch.
     */
    orderBy?: DeliveryPhotoOrderByWithRelationInput | DeliveryPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DeliveryPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeliveryPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeliveryPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DeliveryPhotos
    **/
    _count?: true | DeliveryPhotoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DeliveryPhotoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DeliveryPhotoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DeliveryPhotoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DeliveryPhotoMaxAggregateInputType
  }

  export type GetDeliveryPhotoAggregateType<T extends DeliveryPhotoAggregateArgs> = {
        [P in keyof T & keyof AggregateDeliveryPhoto]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDeliveryPhoto[P]>
      : GetScalarType<T[P], AggregateDeliveryPhoto[P]>
  }




  export type DeliveryPhotoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DeliveryPhotoWhereInput
    orderBy?: DeliveryPhotoOrderByWithAggregationInput | DeliveryPhotoOrderByWithAggregationInput[]
    by: DeliveryPhotoScalarFieldEnum[] | DeliveryPhotoScalarFieldEnum
    having?: DeliveryPhotoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DeliveryPhotoCountAggregateInputType | true
    _avg?: DeliveryPhotoAvgAggregateInputType
    _sum?: DeliveryPhotoSumAggregateInputType
    _min?: DeliveryPhotoMinAggregateInputType
    _max?: DeliveryPhotoMaxAggregateInputType
  }

  export type DeliveryPhotoGroupByOutputType = {
    id: string
    deliveryId: string
    photoId: string
    order: number
    _count: DeliveryPhotoCountAggregateOutputType | null
    _avg: DeliveryPhotoAvgAggregateOutputType | null
    _sum: DeliveryPhotoSumAggregateOutputType | null
    _min: DeliveryPhotoMinAggregateOutputType | null
    _max: DeliveryPhotoMaxAggregateOutputType | null
  }

  type GetDeliveryPhotoGroupByPayload<T extends DeliveryPhotoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DeliveryPhotoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DeliveryPhotoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DeliveryPhotoGroupByOutputType[P]>
            : GetScalarType<T[P], DeliveryPhotoGroupByOutputType[P]>
        }
      >
    >


  export type DeliveryPhotoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deliveryId?: boolean
    photoId?: boolean
    order?: boolean
    delivery?: boolean | DeliveryDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deliveryPhoto"]>

  export type DeliveryPhotoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deliveryId?: boolean
    photoId?: boolean
    order?: boolean
    delivery?: boolean | DeliveryDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deliveryPhoto"]>

  export type DeliveryPhotoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    deliveryId?: boolean
    photoId?: boolean
    order?: boolean
    delivery?: boolean | DeliveryDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["deliveryPhoto"]>

  export type DeliveryPhotoSelectScalar = {
    id?: boolean
    deliveryId?: boolean
    photoId?: boolean
    order?: boolean
  }

  export type DeliveryPhotoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "deliveryId" | "photoId" | "order", ExtArgs["result"]["deliveryPhoto"]>
  export type DeliveryPhotoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    delivery?: boolean | DeliveryDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }
  export type DeliveryPhotoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    delivery?: boolean | DeliveryDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }
  export type DeliveryPhotoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    delivery?: boolean | DeliveryDefaultArgs<ExtArgs>
    photo?: boolean | PhotoDefaultArgs<ExtArgs>
  }

  export type $DeliveryPhotoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DeliveryPhoto"
    objects: {
      delivery: Prisma.$DeliveryPayload<ExtArgs>
      photo: Prisma.$PhotoPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      deliveryId: string
      photoId: string
      order: number
    }, ExtArgs["result"]["deliveryPhoto"]>
    composites: {}
  }

  type DeliveryPhotoGetPayload<S extends boolean | null | undefined | DeliveryPhotoDefaultArgs> = $Result.GetResult<Prisma.$DeliveryPhotoPayload, S>

  type DeliveryPhotoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<DeliveryPhotoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: DeliveryPhotoCountAggregateInputType | true
    }

  export interface DeliveryPhotoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DeliveryPhoto'], meta: { name: 'DeliveryPhoto' } }
    /**
     * Find zero or one DeliveryPhoto that matches the filter.
     * @param {DeliveryPhotoFindUniqueArgs} args - Arguments to find a DeliveryPhoto
     * @example
     * // Get one DeliveryPhoto
     * const deliveryPhoto = await prisma.deliveryPhoto.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DeliveryPhotoFindUniqueArgs>(args: SelectSubset<T, DeliveryPhotoFindUniqueArgs<ExtArgs>>): Prisma__DeliveryPhotoClient<$Result.GetResult<Prisma.$DeliveryPhotoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one DeliveryPhoto that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {DeliveryPhotoFindUniqueOrThrowArgs} args - Arguments to find a DeliveryPhoto
     * @example
     * // Get one DeliveryPhoto
     * const deliveryPhoto = await prisma.deliveryPhoto.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DeliveryPhotoFindUniqueOrThrowArgs>(args: SelectSubset<T, DeliveryPhotoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DeliveryPhotoClient<$Result.GetResult<Prisma.$DeliveryPhotoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeliveryPhoto that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryPhotoFindFirstArgs} args - Arguments to find a DeliveryPhoto
     * @example
     * // Get one DeliveryPhoto
     * const deliveryPhoto = await prisma.deliveryPhoto.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DeliveryPhotoFindFirstArgs>(args?: SelectSubset<T, DeliveryPhotoFindFirstArgs<ExtArgs>>): Prisma__DeliveryPhotoClient<$Result.GetResult<Prisma.$DeliveryPhotoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first DeliveryPhoto that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryPhotoFindFirstOrThrowArgs} args - Arguments to find a DeliveryPhoto
     * @example
     * // Get one DeliveryPhoto
     * const deliveryPhoto = await prisma.deliveryPhoto.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DeliveryPhotoFindFirstOrThrowArgs>(args?: SelectSubset<T, DeliveryPhotoFindFirstOrThrowArgs<ExtArgs>>): Prisma__DeliveryPhotoClient<$Result.GetResult<Prisma.$DeliveryPhotoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more DeliveryPhotos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryPhotoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DeliveryPhotos
     * const deliveryPhotos = await prisma.deliveryPhoto.findMany()
     * 
     * // Get first 10 DeliveryPhotos
     * const deliveryPhotos = await prisma.deliveryPhoto.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const deliveryPhotoWithIdOnly = await prisma.deliveryPhoto.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DeliveryPhotoFindManyArgs>(args?: SelectSubset<T, DeliveryPhotoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliveryPhotoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a DeliveryPhoto.
     * @param {DeliveryPhotoCreateArgs} args - Arguments to create a DeliveryPhoto.
     * @example
     * // Create one DeliveryPhoto
     * const DeliveryPhoto = await prisma.deliveryPhoto.create({
     *   data: {
     *     // ... data to create a DeliveryPhoto
     *   }
     * })
     * 
     */
    create<T extends DeliveryPhotoCreateArgs>(args: SelectSubset<T, DeliveryPhotoCreateArgs<ExtArgs>>): Prisma__DeliveryPhotoClient<$Result.GetResult<Prisma.$DeliveryPhotoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many DeliveryPhotos.
     * @param {DeliveryPhotoCreateManyArgs} args - Arguments to create many DeliveryPhotos.
     * @example
     * // Create many DeliveryPhotos
     * const deliveryPhoto = await prisma.deliveryPhoto.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DeliveryPhotoCreateManyArgs>(args?: SelectSubset<T, DeliveryPhotoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many DeliveryPhotos and returns the data saved in the database.
     * @param {DeliveryPhotoCreateManyAndReturnArgs} args - Arguments to create many DeliveryPhotos.
     * @example
     * // Create many DeliveryPhotos
     * const deliveryPhoto = await prisma.deliveryPhoto.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many DeliveryPhotos and only return the `id`
     * const deliveryPhotoWithIdOnly = await prisma.deliveryPhoto.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends DeliveryPhotoCreateManyAndReturnArgs>(args?: SelectSubset<T, DeliveryPhotoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliveryPhotoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a DeliveryPhoto.
     * @param {DeliveryPhotoDeleteArgs} args - Arguments to delete one DeliveryPhoto.
     * @example
     * // Delete one DeliveryPhoto
     * const DeliveryPhoto = await prisma.deliveryPhoto.delete({
     *   where: {
     *     // ... filter to delete one DeliveryPhoto
     *   }
     * })
     * 
     */
    delete<T extends DeliveryPhotoDeleteArgs>(args: SelectSubset<T, DeliveryPhotoDeleteArgs<ExtArgs>>): Prisma__DeliveryPhotoClient<$Result.GetResult<Prisma.$DeliveryPhotoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one DeliveryPhoto.
     * @param {DeliveryPhotoUpdateArgs} args - Arguments to update one DeliveryPhoto.
     * @example
     * // Update one DeliveryPhoto
     * const deliveryPhoto = await prisma.deliveryPhoto.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DeliveryPhotoUpdateArgs>(args: SelectSubset<T, DeliveryPhotoUpdateArgs<ExtArgs>>): Prisma__DeliveryPhotoClient<$Result.GetResult<Prisma.$DeliveryPhotoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more DeliveryPhotos.
     * @param {DeliveryPhotoDeleteManyArgs} args - Arguments to filter DeliveryPhotos to delete.
     * @example
     * // Delete a few DeliveryPhotos
     * const { count } = await prisma.deliveryPhoto.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DeliveryPhotoDeleteManyArgs>(args?: SelectSubset<T, DeliveryPhotoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeliveryPhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryPhotoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DeliveryPhotos
     * const deliveryPhoto = await prisma.deliveryPhoto.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DeliveryPhotoUpdateManyArgs>(args: SelectSubset<T, DeliveryPhotoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DeliveryPhotos and returns the data updated in the database.
     * @param {DeliveryPhotoUpdateManyAndReturnArgs} args - Arguments to update many DeliveryPhotos.
     * @example
     * // Update many DeliveryPhotos
     * const deliveryPhoto = await prisma.deliveryPhoto.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more DeliveryPhotos and only return the `id`
     * const deliveryPhotoWithIdOnly = await prisma.deliveryPhoto.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends DeliveryPhotoUpdateManyAndReturnArgs>(args: SelectSubset<T, DeliveryPhotoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DeliveryPhotoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one DeliveryPhoto.
     * @param {DeliveryPhotoUpsertArgs} args - Arguments to update or create a DeliveryPhoto.
     * @example
     * // Update or create a DeliveryPhoto
     * const deliveryPhoto = await prisma.deliveryPhoto.upsert({
     *   create: {
     *     // ... data to create a DeliveryPhoto
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DeliveryPhoto we want to update
     *   }
     * })
     */
    upsert<T extends DeliveryPhotoUpsertArgs>(args: SelectSubset<T, DeliveryPhotoUpsertArgs<ExtArgs>>): Prisma__DeliveryPhotoClient<$Result.GetResult<Prisma.$DeliveryPhotoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of DeliveryPhotos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryPhotoCountArgs} args - Arguments to filter DeliveryPhotos to count.
     * @example
     * // Count the number of DeliveryPhotos
     * const count = await prisma.deliveryPhoto.count({
     *   where: {
     *     // ... the filter for the DeliveryPhotos we want to count
     *   }
     * })
    **/
    count<T extends DeliveryPhotoCountArgs>(
      args?: Subset<T, DeliveryPhotoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DeliveryPhotoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DeliveryPhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryPhotoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DeliveryPhotoAggregateArgs>(args: Subset<T, DeliveryPhotoAggregateArgs>): Prisma.PrismaPromise<GetDeliveryPhotoAggregateType<T>>

    /**
     * Group by DeliveryPhoto.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DeliveryPhotoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DeliveryPhotoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DeliveryPhotoGroupByArgs['orderBy'] }
        : { orderBy?: DeliveryPhotoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DeliveryPhotoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDeliveryPhotoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DeliveryPhoto model
   */
  readonly fields: DeliveryPhotoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DeliveryPhoto.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DeliveryPhotoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    delivery<T extends DeliveryDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DeliveryDefaultArgs<ExtArgs>>): Prisma__DeliveryClient<$Result.GetResult<Prisma.$DeliveryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    photo<T extends PhotoDefaultArgs<ExtArgs> = {}>(args?: Subset<T, PhotoDefaultArgs<ExtArgs>>): Prisma__PhotoClient<$Result.GetResult<Prisma.$PhotoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DeliveryPhoto model
   */
  interface DeliveryPhotoFieldRefs {
    readonly id: FieldRef<"DeliveryPhoto", 'String'>
    readonly deliveryId: FieldRef<"DeliveryPhoto", 'String'>
    readonly photoId: FieldRef<"DeliveryPhoto", 'String'>
    readonly order: FieldRef<"DeliveryPhoto", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * DeliveryPhoto findUnique
   */
  export type DeliveryPhotoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoInclude<ExtArgs> | null
    /**
     * Filter, which DeliveryPhoto to fetch.
     */
    where: DeliveryPhotoWhereUniqueInput
  }

  /**
   * DeliveryPhoto findUniqueOrThrow
   */
  export type DeliveryPhotoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoInclude<ExtArgs> | null
    /**
     * Filter, which DeliveryPhoto to fetch.
     */
    where: DeliveryPhotoWhereUniqueInput
  }

  /**
   * DeliveryPhoto findFirst
   */
  export type DeliveryPhotoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoInclude<ExtArgs> | null
    /**
     * Filter, which DeliveryPhoto to fetch.
     */
    where?: DeliveryPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeliveryPhotos to fetch.
     */
    orderBy?: DeliveryPhotoOrderByWithRelationInput | DeliveryPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeliveryPhotos.
     */
    cursor?: DeliveryPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeliveryPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeliveryPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeliveryPhotos.
     */
    distinct?: DeliveryPhotoScalarFieldEnum | DeliveryPhotoScalarFieldEnum[]
  }

  /**
   * DeliveryPhoto findFirstOrThrow
   */
  export type DeliveryPhotoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoInclude<ExtArgs> | null
    /**
     * Filter, which DeliveryPhoto to fetch.
     */
    where?: DeliveryPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeliveryPhotos to fetch.
     */
    orderBy?: DeliveryPhotoOrderByWithRelationInput | DeliveryPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DeliveryPhotos.
     */
    cursor?: DeliveryPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeliveryPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeliveryPhotos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DeliveryPhotos.
     */
    distinct?: DeliveryPhotoScalarFieldEnum | DeliveryPhotoScalarFieldEnum[]
  }

  /**
   * DeliveryPhoto findMany
   */
  export type DeliveryPhotoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoInclude<ExtArgs> | null
    /**
     * Filter, which DeliveryPhotos to fetch.
     */
    where?: DeliveryPhotoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DeliveryPhotos to fetch.
     */
    orderBy?: DeliveryPhotoOrderByWithRelationInput | DeliveryPhotoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DeliveryPhotos.
     */
    cursor?: DeliveryPhotoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DeliveryPhotos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DeliveryPhotos.
     */
    skip?: number
    distinct?: DeliveryPhotoScalarFieldEnum | DeliveryPhotoScalarFieldEnum[]
  }

  /**
   * DeliveryPhoto create
   */
  export type DeliveryPhotoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoInclude<ExtArgs> | null
    /**
     * The data needed to create a DeliveryPhoto.
     */
    data: XOR<DeliveryPhotoCreateInput, DeliveryPhotoUncheckedCreateInput>
  }

  /**
   * DeliveryPhoto createMany
   */
  export type DeliveryPhotoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DeliveryPhotos.
     */
    data: DeliveryPhotoCreateManyInput | DeliveryPhotoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * DeliveryPhoto createManyAndReturn
   */
  export type DeliveryPhotoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * The data used to create many DeliveryPhotos.
     */
    data: DeliveryPhotoCreateManyInput | DeliveryPhotoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeliveryPhoto update
   */
  export type DeliveryPhotoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoInclude<ExtArgs> | null
    /**
     * The data needed to update a DeliveryPhoto.
     */
    data: XOR<DeliveryPhotoUpdateInput, DeliveryPhotoUncheckedUpdateInput>
    /**
     * Choose, which DeliveryPhoto to update.
     */
    where: DeliveryPhotoWhereUniqueInput
  }

  /**
   * DeliveryPhoto updateMany
   */
  export type DeliveryPhotoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DeliveryPhotos.
     */
    data: XOR<DeliveryPhotoUpdateManyMutationInput, DeliveryPhotoUncheckedUpdateManyInput>
    /**
     * Filter which DeliveryPhotos to update
     */
    where?: DeliveryPhotoWhereInput
    /**
     * Limit how many DeliveryPhotos to update.
     */
    limit?: number
  }

  /**
   * DeliveryPhoto updateManyAndReturn
   */
  export type DeliveryPhotoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * The data used to update DeliveryPhotos.
     */
    data: XOR<DeliveryPhotoUpdateManyMutationInput, DeliveryPhotoUncheckedUpdateManyInput>
    /**
     * Filter which DeliveryPhotos to update
     */
    where?: DeliveryPhotoWhereInput
    /**
     * Limit how many DeliveryPhotos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * DeliveryPhoto upsert
   */
  export type DeliveryPhotoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoInclude<ExtArgs> | null
    /**
     * The filter to search for the DeliveryPhoto to update in case it exists.
     */
    where: DeliveryPhotoWhereUniqueInput
    /**
     * In case the DeliveryPhoto found by the `where` argument doesn't exist, create a new DeliveryPhoto with this data.
     */
    create: XOR<DeliveryPhotoCreateInput, DeliveryPhotoUncheckedCreateInput>
    /**
     * In case the DeliveryPhoto was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DeliveryPhotoUpdateInput, DeliveryPhotoUncheckedUpdateInput>
  }

  /**
   * DeliveryPhoto delete
   */
  export type DeliveryPhotoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoInclude<ExtArgs> | null
    /**
     * Filter which DeliveryPhoto to delete.
     */
    where: DeliveryPhotoWhereUniqueInput
  }

  /**
   * DeliveryPhoto deleteMany
   */
  export type DeliveryPhotoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DeliveryPhotos to delete
     */
    where?: DeliveryPhotoWhereInput
    /**
     * Limit how many DeliveryPhotos to delete.
     */
    limit?: number
  }

  /**
   * DeliveryPhoto without action
   */
  export type DeliveryPhotoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DeliveryPhoto
     */
    select?: DeliveryPhotoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the DeliveryPhoto
     */
    omit?: DeliveryPhotoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DeliveryPhotoInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    avatarUrl: 'avatarUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const MessageScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    authorName: 'authorName',
    body: 'body',
    createdAt: 'createdAt'
  };

  export type MessageScalarFieldEnum = (typeof MessageScalarFieldEnum)[keyof typeof MessageScalarFieldEnum]


  export const PhotoScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    url: 'url',
    storagePath: 'storagePath',
    filename: 'filename',
    size: 'size',
    width: 'width',
    height: 'height',
    mimeType: 'mimeType',
    hasPreview: 'hasPreview',
    createdAt: 'createdAt',
    folderId: 'folderId'
  };

  export type PhotoScalarFieldEnum = (typeof PhotoScalarFieldEnum)[keyof typeof PhotoScalarFieldEnum]


  export const PhotoFolderScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    name: 'name',
    createdAt: 'createdAt'
  };

  export type PhotoFolderScalarFieldEnum = (typeof PhotoFolderScalarFieldEnum)[keyof typeof PhotoFolderScalarFieldEnum]


  export const PortfolioScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    slug: 'slug',
    status: 'status',
    template: 'template',
    customDomain: 'customDomain',
    content: 'content',
    views: 'views',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type PortfolioScalarFieldEnum = (typeof PortfolioScalarFieldEnum)[keyof typeof PortfolioScalarFieldEnum]


  export const LinksPageScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    template: 'template',
    displayName: 'displayName',
    bio: 'bio',
    avatarUrl: 'avatarUrl',
    avatarBg: 'avatarBg',
    avatarInitial: 'avatarInitial',
    bgType: 'bgType',
    bgColor: 'bgColor',
    bgGradFrom: 'bgGradFrom',
    bgGradTo: 'bgGradTo',
    bgGradAngle: 'bgGradAngle',
    bgImageUrl: 'bgImageUrl',
    bgOverlayColor: 'bgOverlayColor',
    bgOverlayOpacity: 'bgOverlayOpacity',
    btnShape: 'btnShape',
    btnVariant: 'btnVariant',
    btnBg: 'btnBg',
    btnText: 'btnText',
    btnBorder: 'btnBorder',
    fontFamily: 'fontFamily',
    fontWeight: 'fontWeight',
    textColor: 'textColor',
    subColor: 'subColor',
    labels: 'labels',
    slug: 'slug',
    published: 'published',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type LinksPageScalarFieldEnum = (typeof LinksPageScalarFieldEnum)[keyof typeof LinksPageScalarFieldEnum]


  export const LinkItemScalarFieldEnum: {
    id: 'id',
    linksPageId: 'linksPageId',
    type: 'type',
    title: 'title',
    url: 'url',
    enabled: 'enabled',
    order: 'order',
    icon: 'icon',
    waCountry: 'waCountry',
    waPhone: 'waPhone',
    waMessage: 'waMessage',
    igUsername: 'igUsername',
    emailAddress: 'emailAddress',
    emailSubject: 'emailSubject',
    createdAt: 'createdAt'
  };

  export type LinkItemScalarFieldEnum = (typeof LinkItemScalarFieldEnum)[keyof typeof LinkItemScalarFieldEnum]


  export const DeliveryScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    client: 'client',
    status: 'status',
    template: 'template',
    layout: 'layout',
    coverUrl: 'coverUrl',
    coverFit: 'coverFit',
    coverPositionX: 'coverPositionX',
    coverPositionY: 'coverPositionY',
    passwordEnabled: 'passwordEnabled',
    password: 'password',
    whitelistEnabled: 'whitelistEnabled',
    whitelist: 'whitelist',
    passwordTitle: 'passwordTitle',
    passwordSubtitle: 'passwordSubtitle',
    passwordHint: 'passwordHint',
    passwordButtonLabel: 'passwordButtonLabel',
    mode: 'mode',
    pricePerPhoto: 'pricePerPhoto',
    priceFullGallery: 'priceFullGallery',
    downloadRes: 'downloadRes',
    logoMode: 'logoMode',
    logoText: 'logoText',
    logoUrl: 'logoUrl',
    logoWidth: 'logoWidth',
    customColors: 'customColors',
    colorBg: 'colorBg',
    colorFg: 'colorFg',
    colorAccent: 'colorAccent',
    colorBtnBg: 'colorBtnBg',
    colorBtnFg: 'colorBtnFg',
    fontFamily: 'fontFamily',
    fontFamily1: 'fontFamily1',
    fontFamily2: 'fontFamily2',
    fontFamily3: 'fontFamily3',
    welcomeMessage: 'welcomeMessage',
    showUpsellBanner: 'showUpsellBanner',
    labels: 'labels',
    slug: 'slug',
    views: 'views',
    expiresAt: 'expiresAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DeliveryScalarFieldEnum = (typeof DeliveryScalarFieldEnum)[keyof typeof DeliveryScalarFieldEnum]


  export const DeliveryPhotoScalarFieldEnum: {
    id: 'id',
    deliveryId: 'deliveryId',
    photoId: 'photoId',
    order: 'order'
  };

  export type DeliveryPhotoScalarFieldEnum = (typeof DeliveryPhotoScalarFieldEnum)[keyof typeof DeliveryPhotoScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    photos?: PhotoListRelationFilter
    photoFolders?: PhotoFolderListRelationFilter
    portfolios?: PortfolioListRelationFilter
    linksPages?: LinksPageListRelationFilter
    deliveries?: DeliveryListRelationFilter
    messages?: MessageListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    photos?: PhotoOrderByRelationAggregateInput
    photoFolders?: PhotoFolderOrderByRelationAggregateInput
    portfolios?: PortfolioOrderByRelationAggregateInput
    linksPages?: LinksPageOrderByRelationAggregateInput
    deliveries?: DeliveryOrderByRelationAggregateInput
    messages?: MessageOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    photos?: PhotoListRelationFilter
    photoFolders?: PhotoFolderListRelationFilter
    portfolios?: PortfolioListRelationFilter
    linksPages?: LinksPageListRelationFilter
    deliveries?: DeliveryListRelationFilter
    messages?: MessageListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrderInput | SortOrder
    avatarUrl?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type MessageWhereInput = {
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    id?: StringFilter<"Message"> | string
    userId?: StringFilter<"Message"> | string
    authorName?: StringFilter<"Message"> | string
    body?: StringFilter<"Message"> | string
    createdAt?: DateTimeFilter<"Message"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type MessageOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    authorName?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type MessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: MessageWhereInput | MessageWhereInput[]
    OR?: MessageWhereInput[]
    NOT?: MessageWhereInput | MessageWhereInput[]
    userId?: StringFilter<"Message"> | string
    authorName?: StringFilter<"Message"> | string
    body?: StringFilter<"Message"> | string
    createdAt?: DateTimeFilter<"Message"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id">

  export type MessageOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    authorName?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
    _count?: MessageCountOrderByAggregateInput
    _max?: MessageMaxOrderByAggregateInput
    _min?: MessageMinOrderByAggregateInput
  }

  export type MessageScalarWhereWithAggregatesInput = {
    AND?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    OR?: MessageScalarWhereWithAggregatesInput[]
    NOT?: MessageScalarWhereWithAggregatesInput | MessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Message"> | string
    userId?: StringWithAggregatesFilter<"Message"> | string
    authorName?: StringWithAggregatesFilter<"Message"> | string
    body?: StringWithAggregatesFilter<"Message"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Message"> | Date | string
  }

  export type PhotoWhereInput = {
    AND?: PhotoWhereInput | PhotoWhereInput[]
    OR?: PhotoWhereInput[]
    NOT?: PhotoWhereInput | PhotoWhereInput[]
    id?: StringFilter<"Photo"> | string
    userId?: StringFilter<"Photo"> | string
    url?: StringFilter<"Photo"> | string
    storagePath?: StringFilter<"Photo"> | string
    filename?: StringFilter<"Photo"> | string
    size?: IntFilter<"Photo"> | number
    width?: IntNullableFilter<"Photo"> | number | null
    height?: IntNullableFilter<"Photo"> | number | null
    mimeType?: StringFilter<"Photo"> | string
    hasPreview?: BoolFilter<"Photo"> | boolean
    createdAt?: DateTimeFilter<"Photo"> | Date | string
    folderId?: StringNullableFilter<"Photo"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    folder?: XOR<PhotoFolderNullableScalarRelationFilter, PhotoFolderWhereInput> | null
    deliveryPhotos?: DeliveryPhotoListRelationFilter
  }

  export type PhotoOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    url?: SortOrder
    storagePath?: SortOrder
    filename?: SortOrder
    size?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    mimeType?: SortOrder
    hasPreview?: SortOrder
    createdAt?: SortOrder
    folderId?: SortOrderInput | SortOrder
    user?: UserOrderByWithRelationInput
    folder?: PhotoFolderOrderByWithRelationInput
    deliveryPhotos?: DeliveryPhotoOrderByRelationAggregateInput
  }

  export type PhotoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PhotoWhereInput | PhotoWhereInput[]
    OR?: PhotoWhereInput[]
    NOT?: PhotoWhereInput | PhotoWhereInput[]
    userId?: StringFilter<"Photo"> | string
    url?: StringFilter<"Photo"> | string
    storagePath?: StringFilter<"Photo"> | string
    filename?: StringFilter<"Photo"> | string
    size?: IntFilter<"Photo"> | number
    width?: IntNullableFilter<"Photo"> | number | null
    height?: IntNullableFilter<"Photo"> | number | null
    mimeType?: StringFilter<"Photo"> | string
    hasPreview?: BoolFilter<"Photo"> | boolean
    createdAt?: DateTimeFilter<"Photo"> | Date | string
    folderId?: StringNullableFilter<"Photo"> | string | null
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    folder?: XOR<PhotoFolderNullableScalarRelationFilter, PhotoFolderWhereInput> | null
    deliveryPhotos?: DeliveryPhotoListRelationFilter
  }, "id">

  export type PhotoOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    url?: SortOrder
    storagePath?: SortOrder
    filename?: SortOrder
    size?: SortOrder
    width?: SortOrderInput | SortOrder
    height?: SortOrderInput | SortOrder
    mimeType?: SortOrder
    hasPreview?: SortOrder
    createdAt?: SortOrder
    folderId?: SortOrderInput | SortOrder
    _count?: PhotoCountOrderByAggregateInput
    _avg?: PhotoAvgOrderByAggregateInput
    _max?: PhotoMaxOrderByAggregateInput
    _min?: PhotoMinOrderByAggregateInput
    _sum?: PhotoSumOrderByAggregateInput
  }

  export type PhotoScalarWhereWithAggregatesInput = {
    AND?: PhotoScalarWhereWithAggregatesInput | PhotoScalarWhereWithAggregatesInput[]
    OR?: PhotoScalarWhereWithAggregatesInput[]
    NOT?: PhotoScalarWhereWithAggregatesInput | PhotoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Photo"> | string
    userId?: StringWithAggregatesFilter<"Photo"> | string
    url?: StringWithAggregatesFilter<"Photo"> | string
    storagePath?: StringWithAggregatesFilter<"Photo"> | string
    filename?: StringWithAggregatesFilter<"Photo"> | string
    size?: IntWithAggregatesFilter<"Photo"> | number
    width?: IntNullableWithAggregatesFilter<"Photo"> | number | null
    height?: IntNullableWithAggregatesFilter<"Photo"> | number | null
    mimeType?: StringWithAggregatesFilter<"Photo"> | string
    hasPreview?: BoolWithAggregatesFilter<"Photo"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Photo"> | Date | string
    folderId?: StringNullableWithAggregatesFilter<"Photo"> | string | null
  }

  export type PhotoFolderWhereInput = {
    AND?: PhotoFolderWhereInput | PhotoFolderWhereInput[]
    OR?: PhotoFolderWhereInput[]
    NOT?: PhotoFolderWhereInput | PhotoFolderWhereInput[]
    id?: StringFilter<"PhotoFolder"> | string
    userId?: StringFilter<"PhotoFolder"> | string
    name?: StringFilter<"PhotoFolder"> | string
    createdAt?: DateTimeFilter<"PhotoFolder"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    photos?: PhotoListRelationFilter
  }

  export type PhotoFolderOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    photos?: PhotoOrderByRelationAggregateInput
  }

  export type PhotoFolderWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: PhotoFolderWhereInput | PhotoFolderWhereInput[]
    OR?: PhotoFolderWhereInput[]
    NOT?: PhotoFolderWhereInput | PhotoFolderWhereInput[]
    userId?: StringFilter<"PhotoFolder"> | string
    name?: StringFilter<"PhotoFolder"> | string
    createdAt?: DateTimeFilter<"PhotoFolder"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    photos?: PhotoListRelationFilter
  }, "id">

  export type PhotoFolderOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
    _count?: PhotoFolderCountOrderByAggregateInput
    _max?: PhotoFolderMaxOrderByAggregateInput
    _min?: PhotoFolderMinOrderByAggregateInput
  }

  export type PhotoFolderScalarWhereWithAggregatesInput = {
    AND?: PhotoFolderScalarWhereWithAggregatesInput | PhotoFolderScalarWhereWithAggregatesInput[]
    OR?: PhotoFolderScalarWhereWithAggregatesInput[]
    NOT?: PhotoFolderScalarWhereWithAggregatesInput | PhotoFolderScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"PhotoFolder"> | string
    userId?: StringWithAggregatesFilter<"PhotoFolder"> | string
    name?: StringWithAggregatesFilter<"PhotoFolder"> | string
    createdAt?: DateTimeWithAggregatesFilter<"PhotoFolder"> | Date | string
  }

  export type PortfolioWhereInput = {
    AND?: PortfolioWhereInput | PortfolioWhereInput[]
    OR?: PortfolioWhereInput[]
    NOT?: PortfolioWhereInput | PortfolioWhereInput[]
    id?: StringFilter<"Portfolio"> | string
    userId?: StringFilter<"Portfolio"> | string
    title?: StringFilter<"Portfolio"> | string
    slug?: StringFilter<"Portfolio"> | string
    status?: StringFilter<"Portfolio"> | string
    template?: StringFilter<"Portfolio"> | string
    customDomain?: StringNullableFilter<"Portfolio"> | string | null
    content?: JsonFilter<"Portfolio">
    views?: IntFilter<"Portfolio"> | number
    createdAt?: DateTimeFilter<"Portfolio"> | Date | string
    updatedAt?: DateTimeFilter<"Portfolio"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }

  export type PortfolioOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    template?: SortOrder
    customDomain?: SortOrderInput | SortOrder
    content?: SortOrder
    views?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type PortfolioWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    customDomain?: string
    AND?: PortfolioWhereInput | PortfolioWhereInput[]
    OR?: PortfolioWhereInput[]
    NOT?: PortfolioWhereInput | PortfolioWhereInput[]
    userId?: StringFilter<"Portfolio"> | string
    title?: StringFilter<"Portfolio"> | string
    status?: StringFilter<"Portfolio"> | string
    template?: StringFilter<"Portfolio"> | string
    content?: JsonFilter<"Portfolio">
    views?: IntFilter<"Portfolio"> | number
    createdAt?: DateTimeFilter<"Portfolio"> | Date | string
    updatedAt?: DateTimeFilter<"Portfolio"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
  }, "id" | "slug" | "customDomain">

  export type PortfolioOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    template?: SortOrder
    customDomain?: SortOrderInput | SortOrder
    content?: SortOrder
    views?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: PortfolioCountOrderByAggregateInput
    _avg?: PortfolioAvgOrderByAggregateInput
    _max?: PortfolioMaxOrderByAggregateInput
    _min?: PortfolioMinOrderByAggregateInput
    _sum?: PortfolioSumOrderByAggregateInput
  }

  export type PortfolioScalarWhereWithAggregatesInput = {
    AND?: PortfolioScalarWhereWithAggregatesInput | PortfolioScalarWhereWithAggregatesInput[]
    OR?: PortfolioScalarWhereWithAggregatesInput[]
    NOT?: PortfolioScalarWhereWithAggregatesInput | PortfolioScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Portfolio"> | string
    userId?: StringWithAggregatesFilter<"Portfolio"> | string
    title?: StringWithAggregatesFilter<"Portfolio"> | string
    slug?: StringWithAggregatesFilter<"Portfolio"> | string
    status?: StringWithAggregatesFilter<"Portfolio"> | string
    template?: StringWithAggregatesFilter<"Portfolio"> | string
    customDomain?: StringNullableWithAggregatesFilter<"Portfolio"> | string | null
    content?: JsonWithAggregatesFilter<"Portfolio">
    views?: IntWithAggregatesFilter<"Portfolio"> | number
    createdAt?: DateTimeWithAggregatesFilter<"Portfolio"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Portfolio"> | Date | string
  }

  export type LinksPageWhereInput = {
    AND?: LinksPageWhereInput | LinksPageWhereInput[]
    OR?: LinksPageWhereInput[]
    NOT?: LinksPageWhereInput | LinksPageWhereInput[]
    id?: StringFilter<"LinksPage"> | string
    userId?: StringFilter<"LinksPage"> | string
    template?: StringFilter<"LinksPage"> | string
    displayName?: StringFilter<"LinksPage"> | string
    bio?: StringFilter<"LinksPage"> | string
    avatarUrl?: StringFilter<"LinksPage"> | string
    avatarBg?: StringFilter<"LinksPage"> | string
    avatarInitial?: StringFilter<"LinksPage"> | string
    bgType?: StringFilter<"LinksPage"> | string
    bgColor?: StringFilter<"LinksPage"> | string
    bgGradFrom?: StringFilter<"LinksPage"> | string
    bgGradTo?: StringFilter<"LinksPage"> | string
    bgGradAngle?: IntFilter<"LinksPage"> | number
    bgImageUrl?: StringFilter<"LinksPage"> | string
    bgOverlayColor?: StringFilter<"LinksPage"> | string
    bgOverlayOpacity?: FloatFilter<"LinksPage"> | number
    btnShape?: StringFilter<"LinksPage"> | string
    btnVariant?: StringFilter<"LinksPage"> | string
    btnBg?: StringFilter<"LinksPage"> | string
    btnText?: StringFilter<"LinksPage"> | string
    btnBorder?: StringFilter<"LinksPage"> | string
    fontFamily?: StringFilter<"LinksPage"> | string
    fontWeight?: StringFilter<"LinksPage"> | string
    textColor?: StringFilter<"LinksPage"> | string
    subColor?: StringFilter<"LinksPage"> | string
    labels?: JsonFilter<"LinksPage">
    slug?: StringNullableFilter<"LinksPage"> | string | null
    published?: BoolFilter<"LinksPage"> | boolean
    createdAt?: DateTimeFilter<"LinksPage"> | Date | string
    updatedAt?: DateTimeFilter<"LinksPage"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    links?: LinkItemListRelationFilter
  }

  export type LinksPageOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    template?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    avatarUrl?: SortOrder
    avatarBg?: SortOrder
    avatarInitial?: SortOrder
    bgType?: SortOrder
    bgColor?: SortOrder
    bgGradFrom?: SortOrder
    bgGradTo?: SortOrder
    bgGradAngle?: SortOrder
    bgImageUrl?: SortOrder
    bgOverlayColor?: SortOrder
    bgOverlayOpacity?: SortOrder
    btnShape?: SortOrder
    btnVariant?: SortOrder
    btnBg?: SortOrder
    btnText?: SortOrder
    btnBorder?: SortOrder
    fontFamily?: SortOrder
    fontWeight?: SortOrder
    textColor?: SortOrder
    subColor?: SortOrder
    labels?: SortOrder
    slug?: SortOrderInput | SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    links?: LinkItemOrderByRelationAggregateInput
  }

  export type LinksPageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: LinksPageWhereInput | LinksPageWhereInput[]
    OR?: LinksPageWhereInput[]
    NOT?: LinksPageWhereInput | LinksPageWhereInput[]
    userId?: StringFilter<"LinksPage"> | string
    template?: StringFilter<"LinksPage"> | string
    displayName?: StringFilter<"LinksPage"> | string
    bio?: StringFilter<"LinksPage"> | string
    avatarUrl?: StringFilter<"LinksPage"> | string
    avatarBg?: StringFilter<"LinksPage"> | string
    avatarInitial?: StringFilter<"LinksPage"> | string
    bgType?: StringFilter<"LinksPage"> | string
    bgColor?: StringFilter<"LinksPage"> | string
    bgGradFrom?: StringFilter<"LinksPage"> | string
    bgGradTo?: StringFilter<"LinksPage"> | string
    bgGradAngle?: IntFilter<"LinksPage"> | number
    bgImageUrl?: StringFilter<"LinksPage"> | string
    bgOverlayColor?: StringFilter<"LinksPage"> | string
    bgOverlayOpacity?: FloatFilter<"LinksPage"> | number
    btnShape?: StringFilter<"LinksPage"> | string
    btnVariant?: StringFilter<"LinksPage"> | string
    btnBg?: StringFilter<"LinksPage"> | string
    btnText?: StringFilter<"LinksPage"> | string
    btnBorder?: StringFilter<"LinksPage"> | string
    fontFamily?: StringFilter<"LinksPage"> | string
    fontWeight?: StringFilter<"LinksPage"> | string
    textColor?: StringFilter<"LinksPage"> | string
    subColor?: StringFilter<"LinksPage"> | string
    labels?: JsonFilter<"LinksPage">
    published?: BoolFilter<"LinksPage"> | boolean
    createdAt?: DateTimeFilter<"LinksPage"> | Date | string
    updatedAt?: DateTimeFilter<"LinksPage"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    links?: LinkItemListRelationFilter
  }, "id" | "slug">

  export type LinksPageOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    template?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    avatarUrl?: SortOrder
    avatarBg?: SortOrder
    avatarInitial?: SortOrder
    bgType?: SortOrder
    bgColor?: SortOrder
    bgGradFrom?: SortOrder
    bgGradTo?: SortOrder
    bgGradAngle?: SortOrder
    bgImageUrl?: SortOrder
    bgOverlayColor?: SortOrder
    bgOverlayOpacity?: SortOrder
    btnShape?: SortOrder
    btnVariant?: SortOrder
    btnBg?: SortOrder
    btnText?: SortOrder
    btnBorder?: SortOrder
    fontFamily?: SortOrder
    fontWeight?: SortOrder
    textColor?: SortOrder
    subColor?: SortOrder
    labels?: SortOrder
    slug?: SortOrderInput | SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: LinksPageCountOrderByAggregateInput
    _avg?: LinksPageAvgOrderByAggregateInput
    _max?: LinksPageMaxOrderByAggregateInput
    _min?: LinksPageMinOrderByAggregateInput
    _sum?: LinksPageSumOrderByAggregateInput
  }

  export type LinksPageScalarWhereWithAggregatesInput = {
    AND?: LinksPageScalarWhereWithAggregatesInput | LinksPageScalarWhereWithAggregatesInput[]
    OR?: LinksPageScalarWhereWithAggregatesInput[]
    NOT?: LinksPageScalarWhereWithAggregatesInput | LinksPageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LinksPage"> | string
    userId?: StringWithAggregatesFilter<"LinksPage"> | string
    template?: StringWithAggregatesFilter<"LinksPage"> | string
    displayName?: StringWithAggregatesFilter<"LinksPage"> | string
    bio?: StringWithAggregatesFilter<"LinksPage"> | string
    avatarUrl?: StringWithAggregatesFilter<"LinksPage"> | string
    avatarBg?: StringWithAggregatesFilter<"LinksPage"> | string
    avatarInitial?: StringWithAggregatesFilter<"LinksPage"> | string
    bgType?: StringWithAggregatesFilter<"LinksPage"> | string
    bgColor?: StringWithAggregatesFilter<"LinksPage"> | string
    bgGradFrom?: StringWithAggregatesFilter<"LinksPage"> | string
    bgGradTo?: StringWithAggregatesFilter<"LinksPage"> | string
    bgGradAngle?: IntWithAggregatesFilter<"LinksPage"> | number
    bgImageUrl?: StringWithAggregatesFilter<"LinksPage"> | string
    bgOverlayColor?: StringWithAggregatesFilter<"LinksPage"> | string
    bgOverlayOpacity?: FloatWithAggregatesFilter<"LinksPage"> | number
    btnShape?: StringWithAggregatesFilter<"LinksPage"> | string
    btnVariant?: StringWithAggregatesFilter<"LinksPage"> | string
    btnBg?: StringWithAggregatesFilter<"LinksPage"> | string
    btnText?: StringWithAggregatesFilter<"LinksPage"> | string
    btnBorder?: StringWithAggregatesFilter<"LinksPage"> | string
    fontFamily?: StringWithAggregatesFilter<"LinksPage"> | string
    fontWeight?: StringWithAggregatesFilter<"LinksPage"> | string
    textColor?: StringWithAggregatesFilter<"LinksPage"> | string
    subColor?: StringWithAggregatesFilter<"LinksPage"> | string
    labels?: JsonWithAggregatesFilter<"LinksPage">
    slug?: StringNullableWithAggregatesFilter<"LinksPage"> | string | null
    published?: BoolWithAggregatesFilter<"LinksPage"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"LinksPage"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"LinksPage"> | Date | string
  }

  export type LinkItemWhereInput = {
    AND?: LinkItemWhereInput | LinkItemWhereInput[]
    OR?: LinkItemWhereInput[]
    NOT?: LinkItemWhereInput | LinkItemWhereInput[]
    id?: StringFilter<"LinkItem"> | string
    linksPageId?: StringFilter<"LinkItem"> | string
    type?: StringFilter<"LinkItem"> | string
    title?: StringFilter<"LinkItem"> | string
    url?: StringFilter<"LinkItem"> | string
    enabled?: BoolFilter<"LinkItem"> | boolean
    order?: IntFilter<"LinkItem"> | number
    icon?: StringFilter<"LinkItem"> | string
    waCountry?: StringNullableFilter<"LinkItem"> | string | null
    waPhone?: StringNullableFilter<"LinkItem"> | string | null
    waMessage?: StringNullableFilter<"LinkItem"> | string | null
    igUsername?: StringNullableFilter<"LinkItem"> | string | null
    emailAddress?: StringNullableFilter<"LinkItem"> | string | null
    emailSubject?: StringNullableFilter<"LinkItem"> | string | null
    createdAt?: DateTimeFilter<"LinkItem"> | Date | string
    linksPage?: XOR<LinksPageScalarRelationFilter, LinksPageWhereInput>
  }

  export type LinkItemOrderByWithRelationInput = {
    id?: SortOrder
    linksPageId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    url?: SortOrder
    enabled?: SortOrder
    order?: SortOrder
    icon?: SortOrder
    waCountry?: SortOrderInput | SortOrder
    waPhone?: SortOrderInput | SortOrder
    waMessage?: SortOrderInput | SortOrder
    igUsername?: SortOrderInput | SortOrder
    emailAddress?: SortOrderInput | SortOrder
    emailSubject?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    linksPage?: LinksPageOrderByWithRelationInput
  }

  export type LinkItemWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LinkItemWhereInput | LinkItemWhereInput[]
    OR?: LinkItemWhereInput[]
    NOT?: LinkItemWhereInput | LinkItemWhereInput[]
    linksPageId?: StringFilter<"LinkItem"> | string
    type?: StringFilter<"LinkItem"> | string
    title?: StringFilter<"LinkItem"> | string
    url?: StringFilter<"LinkItem"> | string
    enabled?: BoolFilter<"LinkItem"> | boolean
    order?: IntFilter<"LinkItem"> | number
    icon?: StringFilter<"LinkItem"> | string
    waCountry?: StringNullableFilter<"LinkItem"> | string | null
    waPhone?: StringNullableFilter<"LinkItem"> | string | null
    waMessage?: StringNullableFilter<"LinkItem"> | string | null
    igUsername?: StringNullableFilter<"LinkItem"> | string | null
    emailAddress?: StringNullableFilter<"LinkItem"> | string | null
    emailSubject?: StringNullableFilter<"LinkItem"> | string | null
    createdAt?: DateTimeFilter<"LinkItem"> | Date | string
    linksPage?: XOR<LinksPageScalarRelationFilter, LinksPageWhereInput>
  }, "id">

  export type LinkItemOrderByWithAggregationInput = {
    id?: SortOrder
    linksPageId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    url?: SortOrder
    enabled?: SortOrder
    order?: SortOrder
    icon?: SortOrder
    waCountry?: SortOrderInput | SortOrder
    waPhone?: SortOrderInput | SortOrder
    waMessage?: SortOrderInput | SortOrder
    igUsername?: SortOrderInput | SortOrder
    emailAddress?: SortOrderInput | SortOrder
    emailSubject?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    _count?: LinkItemCountOrderByAggregateInput
    _avg?: LinkItemAvgOrderByAggregateInput
    _max?: LinkItemMaxOrderByAggregateInput
    _min?: LinkItemMinOrderByAggregateInput
    _sum?: LinkItemSumOrderByAggregateInput
  }

  export type LinkItemScalarWhereWithAggregatesInput = {
    AND?: LinkItemScalarWhereWithAggregatesInput | LinkItemScalarWhereWithAggregatesInput[]
    OR?: LinkItemScalarWhereWithAggregatesInput[]
    NOT?: LinkItemScalarWhereWithAggregatesInput | LinkItemScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LinkItem"> | string
    linksPageId?: StringWithAggregatesFilter<"LinkItem"> | string
    type?: StringWithAggregatesFilter<"LinkItem"> | string
    title?: StringWithAggregatesFilter<"LinkItem"> | string
    url?: StringWithAggregatesFilter<"LinkItem"> | string
    enabled?: BoolWithAggregatesFilter<"LinkItem"> | boolean
    order?: IntWithAggregatesFilter<"LinkItem"> | number
    icon?: StringWithAggregatesFilter<"LinkItem"> | string
    waCountry?: StringNullableWithAggregatesFilter<"LinkItem"> | string | null
    waPhone?: StringNullableWithAggregatesFilter<"LinkItem"> | string | null
    waMessage?: StringNullableWithAggregatesFilter<"LinkItem"> | string | null
    igUsername?: StringNullableWithAggregatesFilter<"LinkItem"> | string | null
    emailAddress?: StringNullableWithAggregatesFilter<"LinkItem"> | string | null
    emailSubject?: StringNullableWithAggregatesFilter<"LinkItem"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"LinkItem"> | Date | string
  }

  export type DeliveryWhereInput = {
    AND?: DeliveryWhereInput | DeliveryWhereInput[]
    OR?: DeliveryWhereInput[]
    NOT?: DeliveryWhereInput | DeliveryWhereInput[]
    id?: StringFilter<"Delivery"> | string
    userId?: StringFilter<"Delivery"> | string
    title?: StringFilter<"Delivery"> | string
    client?: StringFilter<"Delivery"> | string
    status?: StringFilter<"Delivery"> | string
    template?: StringFilter<"Delivery"> | string
    layout?: StringFilter<"Delivery"> | string
    coverUrl?: StringFilter<"Delivery"> | string
    coverFit?: StringFilter<"Delivery"> | string
    coverPositionX?: FloatFilter<"Delivery"> | number
    coverPositionY?: FloatFilter<"Delivery"> | number
    passwordEnabled?: BoolFilter<"Delivery"> | boolean
    password?: StringFilter<"Delivery"> | string
    whitelistEnabled?: BoolFilter<"Delivery"> | boolean
    whitelist?: StringNullableListFilter<"Delivery">
    passwordTitle?: StringFilter<"Delivery"> | string
    passwordSubtitle?: StringFilter<"Delivery"> | string
    passwordHint?: StringFilter<"Delivery"> | string
    passwordButtonLabel?: StringFilter<"Delivery"> | string
    mode?: StringFilter<"Delivery"> | string
    pricePerPhoto?: FloatFilter<"Delivery"> | number
    priceFullGallery?: FloatFilter<"Delivery"> | number
    downloadRes?: StringFilter<"Delivery"> | string
    logoMode?: StringFilter<"Delivery"> | string
    logoText?: StringFilter<"Delivery"> | string
    logoUrl?: StringFilter<"Delivery"> | string
    logoWidth?: IntFilter<"Delivery"> | number
    customColors?: BoolFilter<"Delivery"> | boolean
    colorBg?: StringFilter<"Delivery"> | string
    colorFg?: StringFilter<"Delivery"> | string
    colorAccent?: StringFilter<"Delivery"> | string
    colorBtnBg?: StringFilter<"Delivery"> | string
    colorBtnFg?: StringFilter<"Delivery"> | string
    fontFamily?: StringFilter<"Delivery"> | string
    fontFamily1?: StringFilter<"Delivery"> | string
    fontFamily2?: StringFilter<"Delivery"> | string
    fontFamily3?: StringFilter<"Delivery"> | string
    welcomeMessage?: StringFilter<"Delivery"> | string
    showUpsellBanner?: BoolFilter<"Delivery"> | boolean
    labels?: JsonFilter<"Delivery">
    slug?: StringNullableFilter<"Delivery"> | string | null
    views?: IntFilter<"Delivery"> | number
    expiresAt?: DateTimeNullableFilter<"Delivery"> | Date | string | null
    createdAt?: DateTimeFilter<"Delivery"> | Date | string
    updatedAt?: DateTimeFilter<"Delivery"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    photos?: DeliveryPhotoListRelationFilter
  }

  export type DeliveryOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    client?: SortOrder
    status?: SortOrder
    template?: SortOrder
    layout?: SortOrder
    coverUrl?: SortOrder
    coverFit?: SortOrder
    coverPositionX?: SortOrder
    coverPositionY?: SortOrder
    passwordEnabled?: SortOrder
    password?: SortOrder
    whitelistEnabled?: SortOrder
    whitelist?: SortOrder
    passwordTitle?: SortOrder
    passwordSubtitle?: SortOrder
    passwordHint?: SortOrder
    passwordButtonLabel?: SortOrder
    mode?: SortOrder
    pricePerPhoto?: SortOrder
    priceFullGallery?: SortOrder
    downloadRes?: SortOrder
    logoMode?: SortOrder
    logoText?: SortOrder
    logoUrl?: SortOrder
    logoWidth?: SortOrder
    customColors?: SortOrder
    colorBg?: SortOrder
    colorFg?: SortOrder
    colorAccent?: SortOrder
    colorBtnBg?: SortOrder
    colorBtnFg?: SortOrder
    fontFamily?: SortOrder
    fontFamily1?: SortOrder
    fontFamily2?: SortOrder
    fontFamily3?: SortOrder
    welcomeMessage?: SortOrder
    showUpsellBanner?: SortOrder
    labels?: SortOrder
    slug?: SortOrderInput | SortOrder
    views?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    photos?: DeliveryPhotoOrderByRelationAggregateInput
  }

  export type DeliveryWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    slug?: string
    AND?: DeliveryWhereInput | DeliveryWhereInput[]
    OR?: DeliveryWhereInput[]
    NOT?: DeliveryWhereInput | DeliveryWhereInput[]
    userId?: StringFilter<"Delivery"> | string
    title?: StringFilter<"Delivery"> | string
    client?: StringFilter<"Delivery"> | string
    status?: StringFilter<"Delivery"> | string
    template?: StringFilter<"Delivery"> | string
    layout?: StringFilter<"Delivery"> | string
    coverUrl?: StringFilter<"Delivery"> | string
    coverFit?: StringFilter<"Delivery"> | string
    coverPositionX?: FloatFilter<"Delivery"> | number
    coverPositionY?: FloatFilter<"Delivery"> | number
    passwordEnabled?: BoolFilter<"Delivery"> | boolean
    password?: StringFilter<"Delivery"> | string
    whitelistEnabled?: BoolFilter<"Delivery"> | boolean
    whitelist?: StringNullableListFilter<"Delivery">
    passwordTitle?: StringFilter<"Delivery"> | string
    passwordSubtitle?: StringFilter<"Delivery"> | string
    passwordHint?: StringFilter<"Delivery"> | string
    passwordButtonLabel?: StringFilter<"Delivery"> | string
    mode?: StringFilter<"Delivery"> | string
    pricePerPhoto?: FloatFilter<"Delivery"> | number
    priceFullGallery?: FloatFilter<"Delivery"> | number
    downloadRes?: StringFilter<"Delivery"> | string
    logoMode?: StringFilter<"Delivery"> | string
    logoText?: StringFilter<"Delivery"> | string
    logoUrl?: StringFilter<"Delivery"> | string
    logoWidth?: IntFilter<"Delivery"> | number
    customColors?: BoolFilter<"Delivery"> | boolean
    colorBg?: StringFilter<"Delivery"> | string
    colorFg?: StringFilter<"Delivery"> | string
    colorAccent?: StringFilter<"Delivery"> | string
    colorBtnBg?: StringFilter<"Delivery"> | string
    colorBtnFg?: StringFilter<"Delivery"> | string
    fontFamily?: StringFilter<"Delivery"> | string
    fontFamily1?: StringFilter<"Delivery"> | string
    fontFamily2?: StringFilter<"Delivery"> | string
    fontFamily3?: StringFilter<"Delivery"> | string
    welcomeMessage?: StringFilter<"Delivery"> | string
    showUpsellBanner?: BoolFilter<"Delivery"> | boolean
    labels?: JsonFilter<"Delivery">
    views?: IntFilter<"Delivery"> | number
    expiresAt?: DateTimeNullableFilter<"Delivery"> | Date | string | null
    createdAt?: DateTimeFilter<"Delivery"> | Date | string
    updatedAt?: DateTimeFilter<"Delivery"> | Date | string
    user?: XOR<UserScalarRelationFilter, UserWhereInput>
    photos?: DeliveryPhotoListRelationFilter
  }, "id" | "slug">

  export type DeliveryOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    client?: SortOrder
    status?: SortOrder
    template?: SortOrder
    layout?: SortOrder
    coverUrl?: SortOrder
    coverFit?: SortOrder
    coverPositionX?: SortOrder
    coverPositionY?: SortOrder
    passwordEnabled?: SortOrder
    password?: SortOrder
    whitelistEnabled?: SortOrder
    whitelist?: SortOrder
    passwordTitle?: SortOrder
    passwordSubtitle?: SortOrder
    passwordHint?: SortOrder
    passwordButtonLabel?: SortOrder
    mode?: SortOrder
    pricePerPhoto?: SortOrder
    priceFullGallery?: SortOrder
    downloadRes?: SortOrder
    logoMode?: SortOrder
    logoText?: SortOrder
    logoUrl?: SortOrder
    logoWidth?: SortOrder
    customColors?: SortOrder
    colorBg?: SortOrder
    colorFg?: SortOrder
    colorAccent?: SortOrder
    colorBtnBg?: SortOrder
    colorBtnFg?: SortOrder
    fontFamily?: SortOrder
    fontFamily1?: SortOrder
    fontFamily2?: SortOrder
    fontFamily3?: SortOrder
    welcomeMessage?: SortOrder
    showUpsellBanner?: SortOrder
    labels?: SortOrder
    slug?: SortOrderInput | SortOrder
    views?: SortOrder
    expiresAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DeliveryCountOrderByAggregateInput
    _avg?: DeliveryAvgOrderByAggregateInput
    _max?: DeliveryMaxOrderByAggregateInput
    _min?: DeliveryMinOrderByAggregateInput
    _sum?: DeliverySumOrderByAggregateInput
  }

  export type DeliveryScalarWhereWithAggregatesInput = {
    AND?: DeliveryScalarWhereWithAggregatesInput | DeliveryScalarWhereWithAggregatesInput[]
    OR?: DeliveryScalarWhereWithAggregatesInput[]
    NOT?: DeliveryScalarWhereWithAggregatesInput | DeliveryScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Delivery"> | string
    userId?: StringWithAggregatesFilter<"Delivery"> | string
    title?: StringWithAggregatesFilter<"Delivery"> | string
    client?: StringWithAggregatesFilter<"Delivery"> | string
    status?: StringWithAggregatesFilter<"Delivery"> | string
    template?: StringWithAggregatesFilter<"Delivery"> | string
    layout?: StringWithAggregatesFilter<"Delivery"> | string
    coverUrl?: StringWithAggregatesFilter<"Delivery"> | string
    coverFit?: StringWithAggregatesFilter<"Delivery"> | string
    coverPositionX?: FloatWithAggregatesFilter<"Delivery"> | number
    coverPositionY?: FloatWithAggregatesFilter<"Delivery"> | number
    passwordEnabled?: BoolWithAggregatesFilter<"Delivery"> | boolean
    password?: StringWithAggregatesFilter<"Delivery"> | string
    whitelistEnabled?: BoolWithAggregatesFilter<"Delivery"> | boolean
    whitelist?: StringNullableListFilter<"Delivery">
    passwordTitle?: StringWithAggregatesFilter<"Delivery"> | string
    passwordSubtitle?: StringWithAggregatesFilter<"Delivery"> | string
    passwordHint?: StringWithAggregatesFilter<"Delivery"> | string
    passwordButtonLabel?: StringWithAggregatesFilter<"Delivery"> | string
    mode?: StringWithAggregatesFilter<"Delivery"> | string
    pricePerPhoto?: FloatWithAggregatesFilter<"Delivery"> | number
    priceFullGallery?: FloatWithAggregatesFilter<"Delivery"> | number
    downloadRes?: StringWithAggregatesFilter<"Delivery"> | string
    logoMode?: StringWithAggregatesFilter<"Delivery"> | string
    logoText?: StringWithAggregatesFilter<"Delivery"> | string
    logoUrl?: StringWithAggregatesFilter<"Delivery"> | string
    logoWidth?: IntWithAggregatesFilter<"Delivery"> | number
    customColors?: BoolWithAggregatesFilter<"Delivery"> | boolean
    colorBg?: StringWithAggregatesFilter<"Delivery"> | string
    colorFg?: StringWithAggregatesFilter<"Delivery"> | string
    colorAccent?: StringWithAggregatesFilter<"Delivery"> | string
    colorBtnBg?: StringWithAggregatesFilter<"Delivery"> | string
    colorBtnFg?: StringWithAggregatesFilter<"Delivery"> | string
    fontFamily?: StringWithAggregatesFilter<"Delivery"> | string
    fontFamily1?: StringWithAggregatesFilter<"Delivery"> | string
    fontFamily2?: StringWithAggregatesFilter<"Delivery"> | string
    fontFamily3?: StringWithAggregatesFilter<"Delivery"> | string
    welcomeMessage?: StringWithAggregatesFilter<"Delivery"> | string
    showUpsellBanner?: BoolWithAggregatesFilter<"Delivery"> | boolean
    labels?: JsonWithAggregatesFilter<"Delivery">
    slug?: StringNullableWithAggregatesFilter<"Delivery"> | string | null
    views?: IntWithAggregatesFilter<"Delivery"> | number
    expiresAt?: DateTimeNullableWithAggregatesFilter<"Delivery"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Delivery"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Delivery"> | Date | string
  }

  export type DeliveryPhotoWhereInput = {
    AND?: DeliveryPhotoWhereInput | DeliveryPhotoWhereInput[]
    OR?: DeliveryPhotoWhereInput[]
    NOT?: DeliveryPhotoWhereInput | DeliveryPhotoWhereInput[]
    id?: StringFilter<"DeliveryPhoto"> | string
    deliveryId?: StringFilter<"DeliveryPhoto"> | string
    photoId?: StringFilter<"DeliveryPhoto"> | string
    order?: IntFilter<"DeliveryPhoto"> | number
    delivery?: XOR<DeliveryScalarRelationFilter, DeliveryWhereInput>
    photo?: XOR<PhotoScalarRelationFilter, PhotoWhereInput>
  }

  export type DeliveryPhotoOrderByWithRelationInput = {
    id?: SortOrder
    deliveryId?: SortOrder
    photoId?: SortOrder
    order?: SortOrder
    delivery?: DeliveryOrderByWithRelationInput
    photo?: PhotoOrderByWithRelationInput
  }

  export type DeliveryPhotoWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    deliveryId_photoId?: DeliveryPhotoDeliveryIdPhotoIdCompoundUniqueInput
    AND?: DeliveryPhotoWhereInput | DeliveryPhotoWhereInput[]
    OR?: DeliveryPhotoWhereInput[]
    NOT?: DeliveryPhotoWhereInput | DeliveryPhotoWhereInput[]
    deliveryId?: StringFilter<"DeliveryPhoto"> | string
    photoId?: StringFilter<"DeliveryPhoto"> | string
    order?: IntFilter<"DeliveryPhoto"> | number
    delivery?: XOR<DeliveryScalarRelationFilter, DeliveryWhereInput>
    photo?: XOR<PhotoScalarRelationFilter, PhotoWhereInput>
  }, "id" | "deliveryId_photoId">

  export type DeliveryPhotoOrderByWithAggregationInput = {
    id?: SortOrder
    deliveryId?: SortOrder
    photoId?: SortOrder
    order?: SortOrder
    _count?: DeliveryPhotoCountOrderByAggregateInput
    _avg?: DeliveryPhotoAvgOrderByAggregateInput
    _max?: DeliveryPhotoMaxOrderByAggregateInput
    _min?: DeliveryPhotoMinOrderByAggregateInput
    _sum?: DeliveryPhotoSumOrderByAggregateInput
  }

  export type DeliveryPhotoScalarWhereWithAggregatesInput = {
    AND?: DeliveryPhotoScalarWhereWithAggregatesInput | DeliveryPhotoScalarWhereWithAggregatesInput[]
    OR?: DeliveryPhotoScalarWhereWithAggregatesInput[]
    NOT?: DeliveryPhotoScalarWhereWithAggregatesInput | DeliveryPhotoScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DeliveryPhoto"> | string
    deliveryId?: StringWithAggregatesFilter<"DeliveryPhoto"> | string
    photoId?: StringWithAggregatesFilter<"DeliveryPhoto"> | string
    order?: IntWithAggregatesFilter<"DeliveryPhoto"> | number
  }

  export type UserCreateInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutUserInput
    photoFolders?: PhotoFolderCreateNestedManyWithoutUserInput
    portfolios?: PortfolioCreateNestedManyWithoutUserInput
    linksPages?: LinksPageCreateNestedManyWithoutUserInput
    deliveries?: DeliveryCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutUserInput
    photoFolders?: PhotoFolderUncheckedCreateNestedManyWithoutUserInput
    portfolios?: PortfolioUncheckedCreateNestedManyWithoutUserInput
    linksPages?: LinksPageUncheckedCreateNestedManyWithoutUserInput
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutUserNestedInput
    photoFolders?: PhotoFolderUpdateManyWithoutUserNestedInput
    portfolios?: PortfolioUpdateManyWithoutUserNestedInput
    linksPages?: LinksPageUpdateManyWithoutUserNestedInput
    deliveries?: DeliveryUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutUserNestedInput
    photoFolders?: PhotoFolderUncheckedUpdateManyWithoutUserNestedInput
    portfolios?: PortfolioUncheckedUpdateManyWithoutUserNestedInput
    linksPages?: LinksPageUncheckedUpdateManyWithoutUserNestedInput
    deliveries?: DeliveryUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateInput = {
    id?: string
    authorName?: string
    body: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutMessagesInput
  }

  export type MessageUncheckedCreateInput = {
    id?: string
    userId: string
    authorName?: string
    body: string
    createdAt?: Date | string
  }

  export type MessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type MessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageCreateManyInput = {
    id?: string
    userId: string
    authorName?: string
    body: string
    createdAt?: Date | string
  }

  export type MessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoCreateInput = {
    id?: string
    url: string
    storagePath: string
    filename: string
    size: number
    width?: number | null
    height?: number | null
    mimeType?: string
    hasPreview?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPhotosInput
    folder?: PhotoFolderCreateNestedOneWithoutPhotosInput
    deliveryPhotos?: DeliveryPhotoCreateNestedManyWithoutPhotoInput
  }

  export type PhotoUncheckedCreateInput = {
    id?: string
    userId: string
    url: string
    storagePath: string
    filename: string
    size: number
    width?: number | null
    height?: number | null
    mimeType?: string
    hasPreview?: boolean
    createdAt?: Date | string
    folderId?: string | null
    deliveryPhotos?: DeliveryPhotoUncheckedCreateNestedManyWithoutPhotoInput
  }

  export type PhotoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    hasPreview?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPhotosNestedInput
    folder?: PhotoFolderUpdateOneWithoutPhotosNestedInput
    deliveryPhotos?: DeliveryPhotoUpdateManyWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    hasPreview?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryPhotos?: DeliveryPhotoUncheckedUpdateManyWithoutPhotoNestedInput
  }

  export type PhotoCreateManyInput = {
    id?: string
    userId: string
    url: string
    storagePath: string
    filename: string
    size: number
    width?: number | null
    height?: number | null
    mimeType?: string
    hasPreview?: boolean
    createdAt?: Date | string
    folderId?: string | null
  }

  export type PhotoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    hasPreview?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    hasPreview?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PhotoFolderCreateInput = {
    id?: string
    name: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPhotoFoldersInput
    photos?: PhotoCreateNestedManyWithoutFolderInput
  }

  export type PhotoFolderUncheckedCreateInput = {
    id?: string
    userId: string
    name: string
    createdAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutFolderInput
  }

  export type PhotoFolderUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPhotoFoldersNestedInput
    photos?: PhotoUpdateManyWithoutFolderNestedInput
  }

  export type PhotoFolderUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type PhotoFolderCreateManyInput = {
    id?: string
    userId: string
    name: string
    createdAt?: Date | string
  }

  export type PhotoFolderUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoFolderUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PortfolioCreateInput = {
    id?: string
    title: string
    slug: string
    status?: string
    template?: string
    customDomain?: string | null
    content?: JsonNullValueInput | InputJsonValue
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutPortfoliosInput
  }

  export type PortfolioUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    slug: string
    status?: string
    template?: string
    customDomain?: string | null
    content?: JsonNullValueInput | InputJsonValue
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PortfolioUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    content?: JsonNullValueInput | InputJsonValue
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPortfoliosNestedInput
  }

  export type PortfolioUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    content?: JsonNullValueInput | InputJsonValue
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PortfolioCreateManyInput = {
    id?: string
    userId: string
    title: string
    slug: string
    status?: string
    template?: string
    customDomain?: string | null
    content?: JsonNullValueInput | InputJsonValue
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PortfolioUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    content?: JsonNullValueInput | InputJsonValue
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PortfolioUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    content?: JsonNullValueInput | InputJsonValue
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinksPageCreateInput = {
    id?: string
    template?: string
    displayName?: string
    bio?: string
    avatarUrl?: string
    avatarBg?: string
    avatarInitial?: string
    bgType?: string
    bgColor?: string
    bgGradFrom?: string
    bgGradTo?: string
    bgGradAngle?: number
    bgImageUrl?: string
    bgOverlayColor?: string
    bgOverlayOpacity?: number
    btnShape?: string
    btnVariant?: string
    btnBg?: string
    btnText?: string
    btnBorder?: string
    fontFamily?: string
    fontWeight?: string
    textColor?: string
    subColor?: string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLinksPagesInput
    links?: LinkItemCreateNestedManyWithoutLinksPageInput
  }

  export type LinksPageUncheckedCreateInput = {
    id?: string
    userId: string
    template?: string
    displayName?: string
    bio?: string
    avatarUrl?: string
    avatarBg?: string
    avatarInitial?: string
    bgType?: string
    bgColor?: string
    bgGradFrom?: string
    bgGradTo?: string
    bgGradAngle?: number
    bgImageUrl?: string
    bgOverlayColor?: string
    bgOverlayOpacity?: number
    btnShape?: string
    btnVariant?: string
    btnBg?: string
    btnText?: string
    btnBorder?: string
    fontFamily?: string
    fontWeight?: string
    textColor?: string
    subColor?: string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    links?: LinkItemUncheckedCreateNestedManyWithoutLinksPageInput
  }

  export type LinksPageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    avatarUrl?: StringFieldUpdateOperationsInput | string
    avatarBg?: StringFieldUpdateOperationsInput | string
    avatarInitial?: StringFieldUpdateOperationsInput | string
    bgType?: StringFieldUpdateOperationsInput | string
    bgColor?: StringFieldUpdateOperationsInput | string
    bgGradFrom?: StringFieldUpdateOperationsInput | string
    bgGradTo?: StringFieldUpdateOperationsInput | string
    bgGradAngle?: IntFieldUpdateOperationsInput | number
    bgImageUrl?: StringFieldUpdateOperationsInput | string
    bgOverlayColor?: StringFieldUpdateOperationsInput | string
    bgOverlayOpacity?: FloatFieldUpdateOperationsInput | number
    btnShape?: StringFieldUpdateOperationsInput | string
    btnVariant?: StringFieldUpdateOperationsInput | string
    btnBg?: StringFieldUpdateOperationsInput | string
    btnText?: StringFieldUpdateOperationsInput | string
    btnBorder?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontWeight?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    subColor?: StringFieldUpdateOperationsInput | string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLinksPagesNestedInput
    links?: LinkItemUpdateManyWithoutLinksPageNestedInput
  }

  export type LinksPageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    avatarUrl?: StringFieldUpdateOperationsInput | string
    avatarBg?: StringFieldUpdateOperationsInput | string
    avatarInitial?: StringFieldUpdateOperationsInput | string
    bgType?: StringFieldUpdateOperationsInput | string
    bgColor?: StringFieldUpdateOperationsInput | string
    bgGradFrom?: StringFieldUpdateOperationsInput | string
    bgGradTo?: StringFieldUpdateOperationsInput | string
    bgGradAngle?: IntFieldUpdateOperationsInput | number
    bgImageUrl?: StringFieldUpdateOperationsInput | string
    bgOverlayColor?: StringFieldUpdateOperationsInput | string
    bgOverlayOpacity?: FloatFieldUpdateOperationsInput | number
    btnShape?: StringFieldUpdateOperationsInput | string
    btnVariant?: StringFieldUpdateOperationsInput | string
    btnBg?: StringFieldUpdateOperationsInput | string
    btnText?: StringFieldUpdateOperationsInput | string
    btnBorder?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontWeight?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    subColor?: StringFieldUpdateOperationsInput | string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    links?: LinkItemUncheckedUpdateManyWithoutLinksPageNestedInput
  }

  export type LinksPageCreateManyInput = {
    id?: string
    userId: string
    template?: string
    displayName?: string
    bio?: string
    avatarUrl?: string
    avatarBg?: string
    avatarInitial?: string
    bgType?: string
    bgColor?: string
    bgGradFrom?: string
    bgGradTo?: string
    bgGradAngle?: number
    bgImageUrl?: string
    bgOverlayColor?: string
    bgOverlayOpacity?: number
    btnShape?: string
    btnVariant?: string
    btnBg?: string
    btnText?: string
    btnBorder?: string
    fontFamily?: string
    fontWeight?: string
    textColor?: string
    subColor?: string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LinksPageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    avatarUrl?: StringFieldUpdateOperationsInput | string
    avatarBg?: StringFieldUpdateOperationsInput | string
    avatarInitial?: StringFieldUpdateOperationsInput | string
    bgType?: StringFieldUpdateOperationsInput | string
    bgColor?: StringFieldUpdateOperationsInput | string
    bgGradFrom?: StringFieldUpdateOperationsInput | string
    bgGradTo?: StringFieldUpdateOperationsInput | string
    bgGradAngle?: IntFieldUpdateOperationsInput | number
    bgImageUrl?: StringFieldUpdateOperationsInput | string
    bgOverlayColor?: StringFieldUpdateOperationsInput | string
    bgOverlayOpacity?: FloatFieldUpdateOperationsInput | number
    btnShape?: StringFieldUpdateOperationsInput | string
    btnVariant?: StringFieldUpdateOperationsInput | string
    btnBg?: StringFieldUpdateOperationsInput | string
    btnText?: StringFieldUpdateOperationsInput | string
    btnBorder?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontWeight?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    subColor?: StringFieldUpdateOperationsInput | string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinksPageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    avatarUrl?: StringFieldUpdateOperationsInput | string
    avatarBg?: StringFieldUpdateOperationsInput | string
    avatarInitial?: StringFieldUpdateOperationsInput | string
    bgType?: StringFieldUpdateOperationsInput | string
    bgColor?: StringFieldUpdateOperationsInput | string
    bgGradFrom?: StringFieldUpdateOperationsInput | string
    bgGradTo?: StringFieldUpdateOperationsInput | string
    bgGradAngle?: IntFieldUpdateOperationsInput | number
    bgImageUrl?: StringFieldUpdateOperationsInput | string
    bgOverlayColor?: StringFieldUpdateOperationsInput | string
    bgOverlayOpacity?: FloatFieldUpdateOperationsInput | number
    btnShape?: StringFieldUpdateOperationsInput | string
    btnVariant?: StringFieldUpdateOperationsInput | string
    btnBg?: StringFieldUpdateOperationsInput | string
    btnText?: StringFieldUpdateOperationsInput | string
    btnBorder?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontWeight?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    subColor?: StringFieldUpdateOperationsInput | string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkItemCreateInput = {
    id?: string
    type?: string
    title?: string
    url?: string
    enabled?: boolean
    order?: number
    icon?: string
    waCountry?: string | null
    waPhone?: string | null
    waMessage?: string | null
    igUsername?: string | null
    emailAddress?: string | null
    emailSubject?: string | null
    createdAt?: Date | string
    linksPage: LinksPageCreateNestedOneWithoutLinksInput
  }

  export type LinkItemUncheckedCreateInput = {
    id?: string
    linksPageId: string
    type?: string
    title?: string
    url?: string
    enabled?: boolean
    order?: number
    icon?: string
    waCountry?: string | null
    waPhone?: string | null
    waMessage?: string | null
    igUsername?: string | null
    emailAddress?: string | null
    emailSubject?: string | null
    createdAt?: Date | string
  }

  export type LinkItemUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    icon?: StringFieldUpdateOperationsInput | string
    waCountry?: NullableStringFieldUpdateOperationsInput | string | null
    waPhone?: NullableStringFieldUpdateOperationsInput | string | null
    waMessage?: NullableStringFieldUpdateOperationsInput | string | null
    igUsername?: NullableStringFieldUpdateOperationsInput | string | null
    emailAddress?: NullableStringFieldUpdateOperationsInput | string | null
    emailSubject?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    linksPage?: LinksPageUpdateOneRequiredWithoutLinksNestedInput
  }

  export type LinkItemUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    linksPageId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    icon?: StringFieldUpdateOperationsInput | string
    waCountry?: NullableStringFieldUpdateOperationsInput | string | null
    waPhone?: NullableStringFieldUpdateOperationsInput | string | null
    waMessage?: NullableStringFieldUpdateOperationsInput | string | null
    igUsername?: NullableStringFieldUpdateOperationsInput | string | null
    emailAddress?: NullableStringFieldUpdateOperationsInput | string | null
    emailSubject?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkItemCreateManyInput = {
    id?: string
    linksPageId: string
    type?: string
    title?: string
    url?: string
    enabled?: boolean
    order?: number
    icon?: string
    waCountry?: string | null
    waPhone?: string | null
    waMessage?: string | null
    igUsername?: string | null
    emailAddress?: string | null
    emailSubject?: string | null
    createdAt?: Date | string
  }

  export type LinkItemUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    icon?: StringFieldUpdateOperationsInput | string
    waCountry?: NullableStringFieldUpdateOperationsInput | string | null
    waPhone?: NullableStringFieldUpdateOperationsInput | string | null
    waMessage?: NullableStringFieldUpdateOperationsInput | string | null
    igUsername?: NullableStringFieldUpdateOperationsInput | string | null
    emailAddress?: NullableStringFieldUpdateOperationsInput | string | null
    emailSubject?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkItemUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    linksPageId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    icon?: StringFieldUpdateOperationsInput | string
    waCountry?: NullableStringFieldUpdateOperationsInput | string | null
    waPhone?: NullableStringFieldUpdateOperationsInput | string | null
    waMessage?: NullableStringFieldUpdateOperationsInput | string | null
    igUsername?: NullableStringFieldUpdateOperationsInput | string | null
    emailAddress?: NullableStringFieldUpdateOperationsInput | string | null
    emailSubject?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliveryCreateInput = {
    id?: string
    title?: string
    client?: string
    status?: string
    template?: string
    layout?: string
    coverUrl?: string
    coverFit?: string
    coverPositionX?: number
    coverPositionY?: number
    passwordEnabled?: boolean
    password?: string
    whitelistEnabled?: boolean
    whitelist?: DeliveryCreatewhitelistInput | string[]
    passwordTitle?: string
    passwordSubtitle?: string
    passwordHint?: string
    passwordButtonLabel?: string
    mode?: string
    pricePerPhoto?: number
    priceFullGallery?: number
    downloadRes?: string
    logoMode?: string
    logoText?: string
    logoUrl?: string
    logoWidth?: number
    customColors?: boolean
    colorBg?: string
    colorFg?: string
    colorAccent?: string
    colorBtnBg?: string
    colorBtnFg?: string
    fontFamily?: string
    fontFamily1?: string
    fontFamily2?: string
    fontFamily3?: string
    welcomeMessage?: string
    showUpsellBanner?: boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    views?: number
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDeliveriesInput
    photos?: DeliveryPhotoCreateNestedManyWithoutDeliveryInput
  }

  export type DeliveryUncheckedCreateInput = {
    id?: string
    userId: string
    title?: string
    client?: string
    status?: string
    template?: string
    layout?: string
    coverUrl?: string
    coverFit?: string
    coverPositionX?: number
    coverPositionY?: number
    passwordEnabled?: boolean
    password?: string
    whitelistEnabled?: boolean
    whitelist?: DeliveryCreatewhitelistInput | string[]
    passwordTitle?: string
    passwordSubtitle?: string
    passwordHint?: string
    passwordButtonLabel?: string
    mode?: string
    pricePerPhoto?: number
    priceFullGallery?: number
    downloadRes?: string
    logoMode?: string
    logoText?: string
    logoUrl?: string
    logoWidth?: number
    customColors?: boolean
    colorBg?: string
    colorFg?: string
    colorAccent?: string
    colorBtnBg?: string
    colorBtnFg?: string
    fontFamily?: string
    fontFamily1?: string
    fontFamily2?: string
    fontFamily3?: string
    welcomeMessage?: string
    showUpsellBanner?: boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    views?: number
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: DeliveryPhotoUncheckedCreateNestedManyWithoutDeliveryInput
  }

  export type DeliveryUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    client?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    layout?: StringFieldUpdateOperationsInput | string
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverFit?: StringFieldUpdateOperationsInput | string
    coverPositionX?: FloatFieldUpdateOperationsInput | number
    coverPositionY?: FloatFieldUpdateOperationsInput | number
    passwordEnabled?: BoolFieldUpdateOperationsInput | boolean
    password?: StringFieldUpdateOperationsInput | string
    whitelistEnabled?: BoolFieldUpdateOperationsInput | boolean
    whitelist?: DeliveryUpdatewhitelistInput | string[]
    passwordTitle?: StringFieldUpdateOperationsInput | string
    passwordSubtitle?: StringFieldUpdateOperationsInput | string
    passwordHint?: StringFieldUpdateOperationsInput | string
    passwordButtonLabel?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pricePerPhoto?: FloatFieldUpdateOperationsInput | number
    priceFullGallery?: FloatFieldUpdateOperationsInput | number
    downloadRes?: StringFieldUpdateOperationsInput | string
    logoMode?: StringFieldUpdateOperationsInput | string
    logoText?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    logoWidth?: IntFieldUpdateOperationsInput | number
    customColors?: BoolFieldUpdateOperationsInput | boolean
    colorBg?: StringFieldUpdateOperationsInput | string
    colorFg?: StringFieldUpdateOperationsInput | string
    colorAccent?: StringFieldUpdateOperationsInput | string
    colorBtnBg?: StringFieldUpdateOperationsInput | string
    colorBtnFg?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontFamily1?: StringFieldUpdateOperationsInput | string
    fontFamily2?: StringFieldUpdateOperationsInput | string
    fontFamily3?: StringFieldUpdateOperationsInput | string
    welcomeMessage?: StringFieldUpdateOperationsInput | string
    showUpsellBanner?: BoolFieldUpdateOperationsInput | boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDeliveriesNestedInput
    photos?: DeliveryPhotoUpdateManyWithoutDeliveryNestedInput
  }

  export type DeliveryUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    client?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    layout?: StringFieldUpdateOperationsInput | string
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverFit?: StringFieldUpdateOperationsInput | string
    coverPositionX?: FloatFieldUpdateOperationsInput | number
    coverPositionY?: FloatFieldUpdateOperationsInput | number
    passwordEnabled?: BoolFieldUpdateOperationsInput | boolean
    password?: StringFieldUpdateOperationsInput | string
    whitelistEnabled?: BoolFieldUpdateOperationsInput | boolean
    whitelist?: DeliveryUpdatewhitelistInput | string[]
    passwordTitle?: StringFieldUpdateOperationsInput | string
    passwordSubtitle?: StringFieldUpdateOperationsInput | string
    passwordHint?: StringFieldUpdateOperationsInput | string
    passwordButtonLabel?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pricePerPhoto?: FloatFieldUpdateOperationsInput | number
    priceFullGallery?: FloatFieldUpdateOperationsInput | number
    downloadRes?: StringFieldUpdateOperationsInput | string
    logoMode?: StringFieldUpdateOperationsInput | string
    logoText?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    logoWidth?: IntFieldUpdateOperationsInput | number
    customColors?: BoolFieldUpdateOperationsInput | boolean
    colorBg?: StringFieldUpdateOperationsInput | string
    colorFg?: StringFieldUpdateOperationsInput | string
    colorAccent?: StringFieldUpdateOperationsInput | string
    colorBtnBg?: StringFieldUpdateOperationsInput | string
    colorBtnFg?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontFamily1?: StringFieldUpdateOperationsInput | string
    fontFamily2?: StringFieldUpdateOperationsInput | string
    fontFamily3?: StringFieldUpdateOperationsInput | string
    welcomeMessage?: StringFieldUpdateOperationsInput | string
    showUpsellBanner?: BoolFieldUpdateOperationsInput | boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: DeliveryPhotoUncheckedUpdateManyWithoutDeliveryNestedInput
  }

  export type DeliveryCreateManyInput = {
    id?: string
    userId: string
    title?: string
    client?: string
    status?: string
    template?: string
    layout?: string
    coverUrl?: string
    coverFit?: string
    coverPositionX?: number
    coverPositionY?: number
    passwordEnabled?: boolean
    password?: string
    whitelistEnabled?: boolean
    whitelist?: DeliveryCreatewhitelistInput | string[]
    passwordTitle?: string
    passwordSubtitle?: string
    passwordHint?: string
    passwordButtonLabel?: string
    mode?: string
    pricePerPhoto?: number
    priceFullGallery?: number
    downloadRes?: string
    logoMode?: string
    logoText?: string
    logoUrl?: string
    logoWidth?: number
    customColors?: boolean
    colorBg?: string
    colorFg?: string
    colorAccent?: string
    colorBtnBg?: string
    colorBtnFg?: string
    fontFamily?: string
    fontFamily1?: string
    fontFamily2?: string
    fontFamily3?: string
    welcomeMessage?: string
    showUpsellBanner?: boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    views?: number
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeliveryUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    client?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    layout?: StringFieldUpdateOperationsInput | string
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverFit?: StringFieldUpdateOperationsInput | string
    coverPositionX?: FloatFieldUpdateOperationsInput | number
    coverPositionY?: FloatFieldUpdateOperationsInput | number
    passwordEnabled?: BoolFieldUpdateOperationsInput | boolean
    password?: StringFieldUpdateOperationsInput | string
    whitelistEnabled?: BoolFieldUpdateOperationsInput | boolean
    whitelist?: DeliveryUpdatewhitelistInput | string[]
    passwordTitle?: StringFieldUpdateOperationsInput | string
    passwordSubtitle?: StringFieldUpdateOperationsInput | string
    passwordHint?: StringFieldUpdateOperationsInput | string
    passwordButtonLabel?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pricePerPhoto?: FloatFieldUpdateOperationsInput | number
    priceFullGallery?: FloatFieldUpdateOperationsInput | number
    downloadRes?: StringFieldUpdateOperationsInput | string
    logoMode?: StringFieldUpdateOperationsInput | string
    logoText?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    logoWidth?: IntFieldUpdateOperationsInput | number
    customColors?: BoolFieldUpdateOperationsInput | boolean
    colorBg?: StringFieldUpdateOperationsInput | string
    colorFg?: StringFieldUpdateOperationsInput | string
    colorAccent?: StringFieldUpdateOperationsInput | string
    colorBtnBg?: StringFieldUpdateOperationsInput | string
    colorBtnFg?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontFamily1?: StringFieldUpdateOperationsInput | string
    fontFamily2?: StringFieldUpdateOperationsInput | string
    fontFamily3?: StringFieldUpdateOperationsInput | string
    welcomeMessage?: StringFieldUpdateOperationsInput | string
    showUpsellBanner?: BoolFieldUpdateOperationsInput | boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliveryUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    client?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    layout?: StringFieldUpdateOperationsInput | string
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverFit?: StringFieldUpdateOperationsInput | string
    coverPositionX?: FloatFieldUpdateOperationsInput | number
    coverPositionY?: FloatFieldUpdateOperationsInput | number
    passwordEnabled?: BoolFieldUpdateOperationsInput | boolean
    password?: StringFieldUpdateOperationsInput | string
    whitelistEnabled?: BoolFieldUpdateOperationsInput | boolean
    whitelist?: DeliveryUpdatewhitelistInput | string[]
    passwordTitle?: StringFieldUpdateOperationsInput | string
    passwordSubtitle?: StringFieldUpdateOperationsInput | string
    passwordHint?: StringFieldUpdateOperationsInput | string
    passwordButtonLabel?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pricePerPhoto?: FloatFieldUpdateOperationsInput | number
    priceFullGallery?: FloatFieldUpdateOperationsInput | number
    downloadRes?: StringFieldUpdateOperationsInput | string
    logoMode?: StringFieldUpdateOperationsInput | string
    logoText?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    logoWidth?: IntFieldUpdateOperationsInput | number
    customColors?: BoolFieldUpdateOperationsInput | boolean
    colorBg?: StringFieldUpdateOperationsInput | string
    colorFg?: StringFieldUpdateOperationsInput | string
    colorAccent?: StringFieldUpdateOperationsInput | string
    colorBtnBg?: StringFieldUpdateOperationsInput | string
    colorBtnFg?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontFamily1?: StringFieldUpdateOperationsInput | string
    fontFamily2?: StringFieldUpdateOperationsInput | string
    fontFamily3?: StringFieldUpdateOperationsInput | string
    welcomeMessage?: StringFieldUpdateOperationsInput | string
    showUpsellBanner?: BoolFieldUpdateOperationsInput | boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliveryPhotoCreateInput = {
    id?: string
    order?: number
    delivery: DeliveryCreateNestedOneWithoutPhotosInput
    photo: PhotoCreateNestedOneWithoutDeliveryPhotosInput
  }

  export type DeliveryPhotoUncheckedCreateInput = {
    id?: string
    deliveryId: string
    photoId: string
    order?: number
  }

  export type DeliveryPhotoUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    delivery?: DeliveryUpdateOneRequiredWithoutPhotosNestedInput
    photo?: PhotoUpdateOneRequiredWithoutDeliveryPhotosNestedInput
  }

  export type DeliveryPhotoUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    deliveryId?: StringFieldUpdateOperationsInput | string
    photoId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type DeliveryPhotoCreateManyInput = {
    id?: string
    deliveryId: string
    photoId: string
    order?: number
  }

  export type DeliveryPhotoUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type DeliveryPhotoUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    deliveryId?: StringFieldUpdateOperationsInput | string
    photoId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type PhotoListRelationFilter = {
    every?: PhotoWhereInput
    some?: PhotoWhereInput
    none?: PhotoWhereInput
  }

  export type PhotoFolderListRelationFilter = {
    every?: PhotoFolderWhereInput
    some?: PhotoFolderWhereInput
    none?: PhotoFolderWhereInput
  }

  export type PortfolioListRelationFilter = {
    every?: PortfolioWhereInput
    some?: PortfolioWhereInput
    none?: PortfolioWhereInput
  }

  export type LinksPageListRelationFilter = {
    every?: LinksPageWhereInput
    some?: LinksPageWhereInput
    none?: LinksPageWhereInput
  }

  export type DeliveryListRelationFilter = {
    every?: DeliveryWhereInput
    some?: DeliveryWhereInput
    none?: DeliveryWhereInput
  }

  export type MessageListRelationFilter = {
    every?: MessageWhereInput
    some?: MessageWhereInput
    none?: MessageWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type PhotoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PhotoFolderOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PortfolioOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LinksPageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DeliveryOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type MessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type UserScalarRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type MessageCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    authorName?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    authorName?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
  }

  export type MessageMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    authorName?: SortOrder
    body?: SortOrder
    createdAt?: SortOrder
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type PhotoFolderNullableScalarRelationFilter = {
    is?: PhotoFolderWhereInput | null
    isNot?: PhotoFolderWhereInput | null
  }

  export type DeliveryPhotoListRelationFilter = {
    every?: DeliveryPhotoWhereInput
    some?: DeliveryPhotoWhereInput
    none?: DeliveryPhotoWhereInput
  }

  export type DeliveryPhotoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type PhotoCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    url?: SortOrder
    storagePath?: SortOrder
    filename?: SortOrder
    size?: SortOrder
    width?: SortOrder
    height?: SortOrder
    mimeType?: SortOrder
    hasPreview?: SortOrder
    createdAt?: SortOrder
    folderId?: SortOrder
  }

  export type PhotoAvgOrderByAggregateInput = {
    size?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type PhotoMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    url?: SortOrder
    storagePath?: SortOrder
    filename?: SortOrder
    size?: SortOrder
    width?: SortOrder
    height?: SortOrder
    mimeType?: SortOrder
    hasPreview?: SortOrder
    createdAt?: SortOrder
    folderId?: SortOrder
  }

  export type PhotoMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    url?: SortOrder
    storagePath?: SortOrder
    filename?: SortOrder
    size?: SortOrder
    width?: SortOrder
    height?: SortOrder
    mimeType?: SortOrder
    hasPreview?: SortOrder
    createdAt?: SortOrder
    folderId?: SortOrder
  }

  export type PhotoSumOrderByAggregateInput = {
    size?: SortOrder
    width?: SortOrder
    height?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type PhotoFolderCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoFolderMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }

  export type PhotoFolderMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    name?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type PortfolioCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    template?: SortOrder
    customDomain?: SortOrder
    content?: SortOrder
    views?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PortfolioAvgOrderByAggregateInput = {
    views?: SortOrder
  }

  export type PortfolioMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    template?: SortOrder
    customDomain?: SortOrder
    views?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PortfolioMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    slug?: SortOrder
    status?: SortOrder
    template?: SortOrder
    customDomain?: SortOrder
    views?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type PortfolioSumOrderByAggregateInput = {
    views?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type LinkItemListRelationFilter = {
    every?: LinkItemWhereInput
    some?: LinkItemWhereInput
    none?: LinkItemWhereInput
  }

  export type LinkItemOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LinksPageCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    template?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    avatarUrl?: SortOrder
    avatarBg?: SortOrder
    avatarInitial?: SortOrder
    bgType?: SortOrder
    bgColor?: SortOrder
    bgGradFrom?: SortOrder
    bgGradTo?: SortOrder
    bgGradAngle?: SortOrder
    bgImageUrl?: SortOrder
    bgOverlayColor?: SortOrder
    bgOverlayOpacity?: SortOrder
    btnShape?: SortOrder
    btnVariant?: SortOrder
    btnBg?: SortOrder
    btnText?: SortOrder
    btnBorder?: SortOrder
    fontFamily?: SortOrder
    fontWeight?: SortOrder
    textColor?: SortOrder
    subColor?: SortOrder
    labels?: SortOrder
    slug?: SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LinksPageAvgOrderByAggregateInput = {
    bgGradAngle?: SortOrder
    bgOverlayOpacity?: SortOrder
  }

  export type LinksPageMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    template?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    avatarUrl?: SortOrder
    avatarBg?: SortOrder
    avatarInitial?: SortOrder
    bgType?: SortOrder
    bgColor?: SortOrder
    bgGradFrom?: SortOrder
    bgGradTo?: SortOrder
    bgGradAngle?: SortOrder
    bgImageUrl?: SortOrder
    bgOverlayColor?: SortOrder
    bgOverlayOpacity?: SortOrder
    btnShape?: SortOrder
    btnVariant?: SortOrder
    btnBg?: SortOrder
    btnText?: SortOrder
    btnBorder?: SortOrder
    fontFamily?: SortOrder
    fontWeight?: SortOrder
    textColor?: SortOrder
    subColor?: SortOrder
    slug?: SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LinksPageMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    template?: SortOrder
    displayName?: SortOrder
    bio?: SortOrder
    avatarUrl?: SortOrder
    avatarBg?: SortOrder
    avatarInitial?: SortOrder
    bgType?: SortOrder
    bgColor?: SortOrder
    bgGradFrom?: SortOrder
    bgGradTo?: SortOrder
    bgGradAngle?: SortOrder
    bgImageUrl?: SortOrder
    bgOverlayColor?: SortOrder
    bgOverlayOpacity?: SortOrder
    btnShape?: SortOrder
    btnVariant?: SortOrder
    btnBg?: SortOrder
    btnText?: SortOrder
    btnBorder?: SortOrder
    fontFamily?: SortOrder
    fontWeight?: SortOrder
    textColor?: SortOrder
    subColor?: SortOrder
    slug?: SortOrder
    published?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type LinksPageSumOrderByAggregateInput = {
    bgGradAngle?: SortOrder
    bgOverlayOpacity?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type LinksPageScalarRelationFilter = {
    is?: LinksPageWhereInput
    isNot?: LinksPageWhereInput
  }

  export type LinkItemCountOrderByAggregateInput = {
    id?: SortOrder
    linksPageId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    url?: SortOrder
    enabled?: SortOrder
    order?: SortOrder
    icon?: SortOrder
    waCountry?: SortOrder
    waPhone?: SortOrder
    waMessage?: SortOrder
    igUsername?: SortOrder
    emailAddress?: SortOrder
    emailSubject?: SortOrder
    createdAt?: SortOrder
  }

  export type LinkItemAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type LinkItemMaxOrderByAggregateInput = {
    id?: SortOrder
    linksPageId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    url?: SortOrder
    enabled?: SortOrder
    order?: SortOrder
    icon?: SortOrder
    waCountry?: SortOrder
    waPhone?: SortOrder
    waMessage?: SortOrder
    igUsername?: SortOrder
    emailAddress?: SortOrder
    emailSubject?: SortOrder
    createdAt?: SortOrder
  }

  export type LinkItemMinOrderByAggregateInput = {
    id?: SortOrder
    linksPageId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    url?: SortOrder
    enabled?: SortOrder
    order?: SortOrder
    icon?: SortOrder
    waCountry?: SortOrder
    waPhone?: SortOrder
    waMessage?: SortOrder
    igUsername?: SortOrder
    emailAddress?: SortOrder
    emailSubject?: SortOrder
    createdAt?: SortOrder
  }

  export type LinkItemSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DeliveryCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    client?: SortOrder
    status?: SortOrder
    template?: SortOrder
    layout?: SortOrder
    coverUrl?: SortOrder
    coverFit?: SortOrder
    coverPositionX?: SortOrder
    coverPositionY?: SortOrder
    passwordEnabled?: SortOrder
    password?: SortOrder
    whitelistEnabled?: SortOrder
    whitelist?: SortOrder
    passwordTitle?: SortOrder
    passwordSubtitle?: SortOrder
    passwordHint?: SortOrder
    passwordButtonLabel?: SortOrder
    mode?: SortOrder
    pricePerPhoto?: SortOrder
    priceFullGallery?: SortOrder
    downloadRes?: SortOrder
    logoMode?: SortOrder
    logoText?: SortOrder
    logoUrl?: SortOrder
    logoWidth?: SortOrder
    customColors?: SortOrder
    colorBg?: SortOrder
    colorFg?: SortOrder
    colorAccent?: SortOrder
    colorBtnBg?: SortOrder
    colorBtnFg?: SortOrder
    fontFamily?: SortOrder
    fontFamily1?: SortOrder
    fontFamily2?: SortOrder
    fontFamily3?: SortOrder
    welcomeMessage?: SortOrder
    showUpsellBanner?: SortOrder
    labels?: SortOrder
    slug?: SortOrder
    views?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeliveryAvgOrderByAggregateInput = {
    coverPositionX?: SortOrder
    coverPositionY?: SortOrder
    pricePerPhoto?: SortOrder
    priceFullGallery?: SortOrder
    logoWidth?: SortOrder
    views?: SortOrder
  }

  export type DeliveryMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    client?: SortOrder
    status?: SortOrder
    template?: SortOrder
    layout?: SortOrder
    coverUrl?: SortOrder
    coverFit?: SortOrder
    coverPositionX?: SortOrder
    coverPositionY?: SortOrder
    passwordEnabled?: SortOrder
    password?: SortOrder
    whitelistEnabled?: SortOrder
    passwordTitle?: SortOrder
    passwordSubtitle?: SortOrder
    passwordHint?: SortOrder
    passwordButtonLabel?: SortOrder
    mode?: SortOrder
    pricePerPhoto?: SortOrder
    priceFullGallery?: SortOrder
    downloadRes?: SortOrder
    logoMode?: SortOrder
    logoText?: SortOrder
    logoUrl?: SortOrder
    logoWidth?: SortOrder
    customColors?: SortOrder
    colorBg?: SortOrder
    colorFg?: SortOrder
    colorAccent?: SortOrder
    colorBtnBg?: SortOrder
    colorBtnFg?: SortOrder
    fontFamily?: SortOrder
    fontFamily1?: SortOrder
    fontFamily2?: SortOrder
    fontFamily3?: SortOrder
    welcomeMessage?: SortOrder
    showUpsellBanner?: SortOrder
    slug?: SortOrder
    views?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeliveryMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    client?: SortOrder
    status?: SortOrder
    template?: SortOrder
    layout?: SortOrder
    coverUrl?: SortOrder
    coverFit?: SortOrder
    coverPositionX?: SortOrder
    coverPositionY?: SortOrder
    passwordEnabled?: SortOrder
    password?: SortOrder
    whitelistEnabled?: SortOrder
    passwordTitle?: SortOrder
    passwordSubtitle?: SortOrder
    passwordHint?: SortOrder
    passwordButtonLabel?: SortOrder
    mode?: SortOrder
    pricePerPhoto?: SortOrder
    priceFullGallery?: SortOrder
    downloadRes?: SortOrder
    logoMode?: SortOrder
    logoText?: SortOrder
    logoUrl?: SortOrder
    logoWidth?: SortOrder
    customColors?: SortOrder
    colorBg?: SortOrder
    colorFg?: SortOrder
    colorAccent?: SortOrder
    colorBtnBg?: SortOrder
    colorBtnFg?: SortOrder
    fontFamily?: SortOrder
    fontFamily1?: SortOrder
    fontFamily2?: SortOrder
    fontFamily3?: SortOrder
    welcomeMessage?: SortOrder
    showUpsellBanner?: SortOrder
    slug?: SortOrder
    views?: SortOrder
    expiresAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DeliverySumOrderByAggregateInput = {
    coverPositionX?: SortOrder
    coverPositionY?: SortOrder
    pricePerPhoto?: SortOrder
    priceFullGallery?: SortOrder
    logoWidth?: SortOrder
    views?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DeliveryScalarRelationFilter = {
    is?: DeliveryWhereInput
    isNot?: DeliveryWhereInput
  }

  export type PhotoScalarRelationFilter = {
    is?: PhotoWhereInput
    isNot?: PhotoWhereInput
  }

  export type DeliveryPhotoDeliveryIdPhotoIdCompoundUniqueInput = {
    deliveryId: string
    photoId: string
  }

  export type DeliveryPhotoCountOrderByAggregateInput = {
    id?: SortOrder
    deliveryId?: SortOrder
    photoId?: SortOrder
    order?: SortOrder
  }

  export type DeliveryPhotoAvgOrderByAggregateInput = {
    order?: SortOrder
  }

  export type DeliveryPhotoMaxOrderByAggregateInput = {
    id?: SortOrder
    deliveryId?: SortOrder
    photoId?: SortOrder
    order?: SortOrder
  }

  export type DeliveryPhotoMinOrderByAggregateInput = {
    id?: SortOrder
    deliveryId?: SortOrder
    photoId?: SortOrder
    order?: SortOrder
  }

  export type DeliveryPhotoSumOrderByAggregateInput = {
    order?: SortOrder
  }

  export type PhotoCreateNestedManyWithoutUserInput = {
    create?: XOR<PhotoCreateWithoutUserInput, PhotoUncheckedCreateWithoutUserInput> | PhotoCreateWithoutUserInput[] | PhotoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutUserInput | PhotoCreateOrConnectWithoutUserInput[]
    createMany?: PhotoCreateManyUserInputEnvelope
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
  }

  export type PhotoFolderCreateNestedManyWithoutUserInput = {
    create?: XOR<PhotoFolderCreateWithoutUserInput, PhotoFolderUncheckedCreateWithoutUserInput> | PhotoFolderCreateWithoutUserInput[] | PhotoFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PhotoFolderCreateOrConnectWithoutUserInput | PhotoFolderCreateOrConnectWithoutUserInput[]
    createMany?: PhotoFolderCreateManyUserInputEnvelope
    connect?: PhotoFolderWhereUniqueInput | PhotoFolderWhereUniqueInput[]
  }

  export type PortfolioCreateNestedManyWithoutUserInput = {
    create?: XOR<PortfolioCreateWithoutUserInput, PortfolioUncheckedCreateWithoutUserInput> | PortfolioCreateWithoutUserInput[] | PortfolioUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PortfolioCreateOrConnectWithoutUserInput | PortfolioCreateOrConnectWithoutUserInput[]
    createMany?: PortfolioCreateManyUserInputEnvelope
    connect?: PortfolioWhereUniqueInput | PortfolioWhereUniqueInput[]
  }

  export type LinksPageCreateNestedManyWithoutUserInput = {
    create?: XOR<LinksPageCreateWithoutUserInput, LinksPageUncheckedCreateWithoutUserInput> | LinksPageCreateWithoutUserInput[] | LinksPageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LinksPageCreateOrConnectWithoutUserInput | LinksPageCreateOrConnectWithoutUserInput[]
    createMany?: LinksPageCreateManyUserInputEnvelope
    connect?: LinksPageWhereUniqueInput | LinksPageWhereUniqueInput[]
  }

  export type DeliveryCreateNestedManyWithoutUserInput = {
    create?: XOR<DeliveryCreateWithoutUserInput, DeliveryUncheckedCreateWithoutUserInput> | DeliveryCreateWithoutUserInput[] | DeliveryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeliveryCreateOrConnectWithoutUserInput | DeliveryCreateOrConnectWithoutUserInput[]
    createMany?: DeliveryCreateManyUserInputEnvelope
    connect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
  }

  export type MessageCreateNestedManyWithoutUserInput = {
    create?: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput> | MessageCreateWithoutUserInput[] | MessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutUserInput | MessageCreateOrConnectWithoutUserInput[]
    createMany?: MessageCreateManyUserInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type PhotoUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PhotoCreateWithoutUserInput, PhotoUncheckedCreateWithoutUserInput> | PhotoCreateWithoutUserInput[] | PhotoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutUserInput | PhotoCreateOrConnectWithoutUserInput[]
    createMany?: PhotoCreateManyUserInputEnvelope
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
  }

  export type PhotoFolderUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PhotoFolderCreateWithoutUserInput, PhotoFolderUncheckedCreateWithoutUserInput> | PhotoFolderCreateWithoutUserInput[] | PhotoFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PhotoFolderCreateOrConnectWithoutUserInput | PhotoFolderCreateOrConnectWithoutUserInput[]
    createMany?: PhotoFolderCreateManyUserInputEnvelope
    connect?: PhotoFolderWhereUniqueInput | PhotoFolderWhereUniqueInput[]
  }

  export type PortfolioUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<PortfolioCreateWithoutUserInput, PortfolioUncheckedCreateWithoutUserInput> | PortfolioCreateWithoutUserInput[] | PortfolioUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PortfolioCreateOrConnectWithoutUserInput | PortfolioCreateOrConnectWithoutUserInput[]
    createMany?: PortfolioCreateManyUserInputEnvelope
    connect?: PortfolioWhereUniqueInput | PortfolioWhereUniqueInput[]
  }

  export type LinksPageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LinksPageCreateWithoutUserInput, LinksPageUncheckedCreateWithoutUserInput> | LinksPageCreateWithoutUserInput[] | LinksPageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LinksPageCreateOrConnectWithoutUserInput | LinksPageCreateOrConnectWithoutUserInput[]
    createMany?: LinksPageCreateManyUserInputEnvelope
    connect?: LinksPageWhereUniqueInput | LinksPageWhereUniqueInput[]
  }

  export type DeliveryUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DeliveryCreateWithoutUserInput, DeliveryUncheckedCreateWithoutUserInput> | DeliveryCreateWithoutUserInput[] | DeliveryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeliveryCreateOrConnectWithoutUserInput | DeliveryCreateOrConnectWithoutUserInput[]
    createMany?: DeliveryCreateManyUserInputEnvelope
    connect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
  }

  export type MessageUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput> | MessageCreateWithoutUserInput[] | MessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutUserInput | MessageCreateOrConnectWithoutUserInput[]
    createMany?: MessageCreateManyUserInputEnvelope
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type PhotoUpdateManyWithoutUserNestedInput = {
    create?: XOR<PhotoCreateWithoutUserInput, PhotoUncheckedCreateWithoutUserInput> | PhotoCreateWithoutUserInput[] | PhotoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutUserInput | PhotoCreateOrConnectWithoutUserInput[]
    upsert?: PhotoUpsertWithWhereUniqueWithoutUserInput | PhotoUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PhotoCreateManyUserInputEnvelope
    set?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    disconnect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    delete?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    update?: PhotoUpdateWithWhereUniqueWithoutUserInput | PhotoUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PhotoUpdateManyWithWhereWithoutUserInput | PhotoUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
  }

  export type PhotoFolderUpdateManyWithoutUserNestedInput = {
    create?: XOR<PhotoFolderCreateWithoutUserInput, PhotoFolderUncheckedCreateWithoutUserInput> | PhotoFolderCreateWithoutUserInput[] | PhotoFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PhotoFolderCreateOrConnectWithoutUserInput | PhotoFolderCreateOrConnectWithoutUserInput[]
    upsert?: PhotoFolderUpsertWithWhereUniqueWithoutUserInput | PhotoFolderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PhotoFolderCreateManyUserInputEnvelope
    set?: PhotoFolderWhereUniqueInput | PhotoFolderWhereUniqueInput[]
    disconnect?: PhotoFolderWhereUniqueInput | PhotoFolderWhereUniqueInput[]
    delete?: PhotoFolderWhereUniqueInput | PhotoFolderWhereUniqueInput[]
    connect?: PhotoFolderWhereUniqueInput | PhotoFolderWhereUniqueInput[]
    update?: PhotoFolderUpdateWithWhereUniqueWithoutUserInput | PhotoFolderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PhotoFolderUpdateManyWithWhereWithoutUserInput | PhotoFolderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PhotoFolderScalarWhereInput | PhotoFolderScalarWhereInput[]
  }

  export type PortfolioUpdateManyWithoutUserNestedInput = {
    create?: XOR<PortfolioCreateWithoutUserInput, PortfolioUncheckedCreateWithoutUserInput> | PortfolioCreateWithoutUserInput[] | PortfolioUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PortfolioCreateOrConnectWithoutUserInput | PortfolioCreateOrConnectWithoutUserInput[]
    upsert?: PortfolioUpsertWithWhereUniqueWithoutUserInput | PortfolioUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PortfolioCreateManyUserInputEnvelope
    set?: PortfolioWhereUniqueInput | PortfolioWhereUniqueInput[]
    disconnect?: PortfolioWhereUniqueInput | PortfolioWhereUniqueInput[]
    delete?: PortfolioWhereUniqueInput | PortfolioWhereUniqueInput[]
    connect?: PortfolioWhereUniqueInput | PortfolioWhereUniqueInput[]
    update?: PortfolioUpdateWithWhereUniqueWithoutUserInput | PortfolioUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PortfolioUpdateManyWithWhereWithoutUserInput | PortfolioUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PortfolioScalarWhereInput | PortfolioScalarWhereInput[]
  }

  export type LinksPageUpdateManyWithoutUserNestedInput = {
    create?: XOR<LinksPageCreateWithoutUserInput, LinksPageUncheckedCreateWithoutUserInput> | LinksPageCreateWithoutUserInput[] | LinksPageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LinksPageCreateOrConnectWithoutUserInput | LinksPageCreateOrConnectWithoutUserInput[]
    upsert?: LinksPageUpsertWithWhereUniqueWithoutUserInput | LinksPageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LinksPageCreateManyUserInputEnvelope
    set?: LinksPageWhereUniqueInput | LinksPageWhereUniqueInput[]
    disconnect?: LinksPageWhereUniqueInput | LinksPageWhereUniqueInput[]
    delete?: LinksPageWhereUniqueInput | LinksPageWhereUniqueInput[]
    connect?: LinksPageWhereUniqueInput | LinksPageWhereUniqueInput[]
    update?: LinksPageUpdateWithWhereUniqueWithoutUserInput | LinksPageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LinksPageUpdateManyWithWhereWithoutUserInput | LinksPageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LinksPageScalarWhereInput | LinksPageScalarWhereInput[]
  }

  export type DeliveryUpdateManyWithoutUserNestedInput = {
    create?: XOR<DeliveryCreateWithoutUserInput, DeliveryUncheckedCreateWithoutUserInput> | DeliveryCreateWithoutUserInput[] | DeliveryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeliveryCreateOrConnectWithoutUserInput | DeliveryCreateOrConnectWithoutUserInput[]
    upsert?: DeliveryUpsertWithWhereUniqueWithoutUserInput | DeliveryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DeliveryCreateManyUserInputEnvelope
    set?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    disconnect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    delete?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    connect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    update?: DeliveryUpdateWithWhereUniqueWithoutUserInput | DeliveryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DeliveryUpdateManyWithWhereWithoutUserInput | DeliveryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DeliveryScalarWhereInput | DeliveryScalarWhereInput[]
  }

  export type MessageUpdateManyWithoutUserNestedInput = {
    create?: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput> | MessageCreateWithoutUserInput[] | MessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutUserInput | MessageCreateOrConnectWithoutUserInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutUserInput | MessageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MessageCreateManyUserInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutUserInput | MessageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutUserInput | MessageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type PhotoUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PhotoCreateWithoutUserInput, PhotoUncheckedCreateWithoutUserInput> | PhotoCreateWithoutUserInput[] | PhotoUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutUserInput | PhotoCreateOrConnectWithoutUserInput[]
    upsert?: PhotoUpsertWithWhereUniqueWithoutUserInput | PhotoUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PhotoCreateManyUserInputEnvelope
    set?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    disconnect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    delete?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    update?: PhotoUpdateWithWhereUniqueWithoutUserInput | PhotoUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PhotoUpdateManyWithWhereWithoutUserInput | PhotoUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
  }

  export type PhotoFolderUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PhotoFolderCreateWithoutUserInput, PhotoFolderUncheckedCreateWithoutUserInput> | PhotoFolderCreateWithoutUserInput[] | PhotoFolderUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PhotoFolderCreateOrConnectWithoutUserInput | PhotoFolderCreateOrConnectWithoutUserInput[]
    upsert?: PhotoFolderUpsertWithWhereUniqueWithoutUserInput | PhotoFolderUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PhotoFolderCreateManyUserInputEnvelope
    set?: PhotoFolderWhereUniqueInput | PhotoFolderWhereUniqueInput[]
    disconnect?: PhotoFolderWhereUniqueInput | PhotoFolderWhereUniqueInput[]
    delete?: PhotoFolderWhereUniqueInput | PhotoFolderWhereUniqueInput[]
    connect?: PhotoFolderWhereUniqueInput | PhotoFolderWhereUniqueInput[]
    update?: PhotoFolderUpdateWithWhereUniqueWithoutUserInput | PhotoFolderUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PhotoFolderUpdateManyWithWhereWithoutUserInput | PhotoFolderUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PhotoFolderScalarWhereInput | PhotoFolderScalarWhereInput[]
  }

  export type PortfolioUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<PortfolioCreateWithoutUserInput, PortfolioUncheckedCreateWithoutUserInput> | PortfolioCreateWithoutUserInput[] | PortfolioUncheckedCreateWithoutUserInput[]
    connectOrCreate?: PortfolioCreateOrConnectWithoutUserInput | PortfolioCreateOrConnectWithoutUserInput[]
    upsert?: PortfolioUpsertWithWhereUniqueWithoutUserInput | PortfolioUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: PortfolioCreateManyUserInputEnvelope
    set?: PortfolioWhereUniqueInput | PortfolioWhereUniqueInput[]
    disconnect?: PortfolioWhereUniqueInput | PortfolioWhereUniqueInput[]
    delete?: PortfolioWhereUniqueInput | PortfolioWhereUniqueInput[]
    connect?: PortfolioWhereUniqueInput | PortfolioWhereUniqueInput[]
    update?: PortfolioUpdateWithWhereUniqueWithoutUserInput | PortfolioUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: PortfolioUpdateManyWithWhereWithoutUserInput | PortfolioUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: PortfolioScalarWhereInput | PortfolioScalarWhereInput[]
  }

  export type LinksPageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LinksPageCreateWithoutUserInput, LinksPageUncheckedCreateWithoutUserInput> | LinksPageCreateWithoutUserInput[] | LinksPageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LinksPageCreateOrConnectWithoutUserInput | LinksPageCreateOrConnectWithoutUserInput[]
    upsert?: LinksPageUpsertWithWhereUniqueWithoutUserInput | LinksPageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LinksPageCreateManyUserInputEnvelope
    set?: LinksPageWhereUniqueInput | LinksPageWhereUniqueInput[]
    disconnect?: LinksPageWhereUniqueInput | LinksPageWhereUniqueInput[]
    delete?: LinksPageWhereUniqueInput | LinksPageWhereUniqueInput[]
    connect?: LinksPageWhereUniqueInput | LinksPageWhereUniqueInput[]
    update?: LinksPageUpdateWithWhereUniqueWithoutUserInput | LinksPageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LinksPageUpdateManyWithWhereWithoutUserInput | LinksPageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LinksPageScalarWhereInput | LinksPageScalarWhereInput[]
  }

  export type DeliveryUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DeliveryCreateWithoutUserInput, DeliveryUncheckedCreateWithoutUserInput> | DeliveryCreateWithoutUserInput[] | DeliveryUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DeliveryCreateOrConnectWithoutUserInput | DeliveryCreateOrConnectWithoutUserInput[]
    upsert?: DeliveryUpsertWithWhereUniqueWithoutUserInput | DeliveryUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DeliveryCreateManyUserInputEnvelope
    set?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    disconnect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    delete?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    connect?: DeliveryWhereUniqueInput | DeliveryWhereUniqueInput[]
    update?: DeliveryUpdateWithWhereUniqueWithoutUserInput | DeliveryUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DeliveryUpdateManyWithWhereWithoutUserInput | DeliveryUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DeliveryScalarWhereInput | DeliveryScalarWhereInput[]
  }

  export type MessageUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput> | MessageCreateWithoutUserInput[] | MessageUncheckedCreateWithoutUserInput[]
    connectOrCreate?: MessageCreateOrConnectWithoutUserInput | MessageCreateOrConnectWithoutUserInput[]
    upsert?: MessageUpsertWithWhereUniqueWithoutUserInput | MessageUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: MessageCreateManyUserInputEnvelope
    set?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    disconnect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    delete?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    connect?: MessageWhereUniqueInput | MessageWhereUniqueInput[]
    update?: MessageUpdateWithWhereUniqueWithoutUserInput | MessageUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: MessageUpdateManyWithWhereWithoutUserInput | MessageUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: MessageScalarWhereInput | MessageScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutMessagesInput = {
    create?: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutMessagesInput
    upsert?: UserUpsertWithoutMessagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutMessagesInput, UserUpdateWithoutMessagesInput>, UserUncheckedUpdateWithoutMessagesInput>
  }

  export type UserCreateNestedOneWithoutPhotosInput = {
    create?: XOR<UserCreateWithoutPhotosInput, UserUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: UserCreateOrConnectWithoutPhotosInput
    connect?: UserWhereUniqueInput
  }

  export type PhotoFolderCreateNestedOneWithoutPhotosInput = {
    create?: XOR<PhotoFolderCreateWithoutPhotosInput, PhotoFolderUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: PhotoFolderCreateOrConnectWithoutPhotosInput
    connect?: PhotoFolderWhereUniqueInput
  }

  export type DeliveryPhotoCreateNestedManyWithoutPhotoInput = {
    create?: XOR<DeliveryPhotoCreateWithoutPhotoInput, DeliveryPhotoUncheckedCreateWithoutPhotoInput> | DeliveryPhotoCreateWithoutPhotoInput[] | DeliveryPhotoUncheckedCreateWithoutPhotoInput[]
    connectOrCreate?: DeliveryPhotoCreateOrConnectWithoutPhotoInput | DeliveryPhotoCreateOrConnectWithoutPhotoInput[]
    createMany?: DeliveryPhotoCreateManyPhotoInputEnvelope
    connect?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
  }

  export type DeliveryPhotoUncheckedCreateNestedManyWithoutPhotoInput = {
    create?: XOR<DeliveryPhotoCreateWithoutPhotoInput, DeliveryPhotoUncheckedCreateWithoutPhotoInput> | DeliveryPhotoCreateWithoutPhotoInput[] | DeliveryPhotoUncheckedCreateWithoutPhotoInput[]
    connectOrCreate?: DeliveryPhotoCreateOrConnectWithoutPhotoInput | DeliveryPhotoCreateOrConnectWithoutPhotoInput[]
    createMany?: DeliveryPhotoCreateManyPhotoInputEnvelope
    connect?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserUpdateOneRequiredWithoutPhotosNestedInput = {
    create?: XOR<UserCreateWithoutPhotosInput, UserUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: UserCreateOrConnectWithoutPhotosInput
    upsert?: UserUpsertWithoutPhotosInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPhotosInput, UserUpdateWithoutPhotosInput>, UserUncheckedUpdateWithoutPhotosInput>
  }

  export type PhotoFolderUpdateOneWithoutPhotosNestedInput = {
    create?: XOR<PhotoFolderCreateWithoutPhotosInput, PhotoFolderUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: PhotoFolderCreateOrConnectWithoutPhotosInput
    upsert?: PhotoFolderUpsertWithoutPhotosInput
    disconnect?: PhotoFolderWhereInput | boolean
    delete?: PhotoFolderWhereInput | boolean
    connect?: PhotoFolderWhereUniqueInput
    update?: XOR<XOR<PhotoFolderUpdateToOneWithWhereWithoutPhotosInput, PhotoFolderUpdateWithoutPhotosInput>, PhotoFolderUncheckedUpdateWithoutPhotosInput>
  }

  export type DeliveryPhotoUpdateManyWithoutPhotoNestedInput = {
    create?: XOR<DeliveryPhotoCreateWithoutPhotoInput, DeliveryPhotoUncheckedCreateWithoutPhotoInput> | DeliveryPhotoCreateWithoutPhotoInput[] | DeliveryPhotoUncheckedCreateWithoutPhotoInput[]
    connectOrCreate?: DeliveryPhotoCreateOrConnectWithoutPhotoInput | DeliveryPhotoCreateOrConnectWithoutPhotoInput[]
    upsert?: DeliveryPhotoUpsertWithWhereUniqueWithoutPhotoInput | DeliveryPhotoUpsertWithWhereUniqueWithoutPhotoInput[]
    createMany?: DeliveryPhotoCreateManyPhotoInputEnvelope
    set?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    disconnect?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    delete?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    connect?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    update?: DeliveryPhotoUpdateWithWhereUniqueWithoutPhotoInput | DeliveryPhotoUpdateWithWhereUniqueWithoutPhotoInput[]
    updateMany?: DeliveryPhotoUpdateManyWithWhereWithoutPhotoInput | DeliveryPhotoUpdateManyWithWhereWithoutPhotoInput[]
    deleteMany?: DeliveryPhotoScalarWhereInput | DeliveryPhotoScalarWhereInput[]
  }

  export type DeliveryPhotoUncheckedUpdateManyWithoutPhotoNestedInput = {
    create?: XOR<DeliveryPhotoCreateWithoutPhotoInput, DeliveryPhotoUncheckedCreateWithoutPhotoInput> | DeliveryPhotoCreateWithoutPhotoInput[] | DeliveryPhotoUncheckedCreateWithoutPhotoInput[]
    connectOrCreate?: DeliveryPhotoCreateOrConnectWithoutPhotoInput | DeliveryPhotoCreateOrConnectWithoutPhotoInput[]
    upsert?: DeliveryPhotoUpsertWithWhereUniqueWithoutPhotoInput | DeliveryPhotoUpsertWithWhereUniqueWithoutPhotoInput[]
    createMany?: DeliveryPhotoCreateManyPhotoInputEnvelope
    set?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    disconnect?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    delete?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    connect?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    update?: DeliveryPhotoUpdateWithWhereUniqueWithoutPhotoInput | DeliveryPhotoUpdateWithWhereUniqueWithoutPhotoInput[]
    updateMany?: DeliveryPhotoUpdateManyWithWhereWithoutPhotoInput | DeliveryPhotoUpdateManyWithWhereWithoutPhotoInput[]
    deleteMany?: DeliveryPhotoScalarWhereInput | DeliveryPhotoScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPhotoFoldersInput = {
    create?: XOR<UserCreateWithoutPhotoFoldersInput, UserUncheckedCreateWithoutPhotoFoldersInput>
    connectOrCreate?: UserCreateOrConnectWithoutPhotoFoldersInput
    connect?: UserWhereUniqueInput
  }

  export type PhotoCreateNestedManyWithoutFolderInput = {
    create?: XOR<PhotoCreateWithoutFolderInput, PhotoUncheckedCreateWithoutFolderInput> | PhotoCreateWithoutFolderInput[] | PhotoUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutFolderInput | PhotoCreateOrConnectWithoutFolderInput[]
    createMany?: PhotoCreateManyFolderInputEnvelope
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
  }

  export type PhotoUncheckedCreateNestedManyWithoutFolderInput = {
    create?: XOR<PhotoCreateWithoutFolderInput, PhotoUncheckedCreateWithoutFolderInput> | PhotoCreateWithoutFolderInput[] | PhotoUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutFolderInput | PhotoCreateOrConnectWithoutFolderInput[]
    createMany?: PhotoCreateManyFolderInputEnvelope
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
  }

  export type UserUpdateOneRequiredWithoutPhotoFoldersNestedInput = {
    create?: XOR<UserCreateWithoutPhotoFoldersInput, UserUncheckedCreateWithoutPhotoFoldersInput>
    connectOrCreate?: UserCreateOrConnectWithoutPhotoFoldersInput
    upsert?: UserUpsertWithoutPhotoFoldersInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPhotoFoldersInput, UserUpdateWithoutPhotoFoldersInput>, UserUncheckedUpdateWithoutPhotoFoldersInput>
  }

  export type PhotoUpdateManyWithoutFolderNestedInput = {
    create?: XOR<PhotoCreateWithoutFolderInput, PhotoUncheckedCreateWithoutFolderInput> | PhotoCreateWithoutFolderInput[] | PhotoUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutFolderInput | PhotoCreateOrConnectWithoutFolderInput[]
    upsert?: PhotoUpsertWithWhereUniqueWithoutFolderInput | PhotoUpsertWithWhereUniqueWithoutFolderInput[]
    createMany?: PhotoCreateManyFolderInputEnvelope
    set?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    disconnect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    delete?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    update?: PhotoUpdateWithWhereUniqueWithoutFolderInput | PhotoUpdateWithWhereUniqueWithoutFolderInput[]
    updateMany?: PhotoUpdateManyWithWhereWithoutFolderInput | PhotoUpdateManyWithWhereWithoutFolderInput[]
    deleteMany?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
  }

  export type PhotoUncheckedUpdateManyWithoutFolderNestedInput = {
    create?: XOR<PhotoCreateWithoutFolderInput, PhotoUncheckedCreateWithoutFolderInput> | PhotoCreateWithoutFolderInput[] | PhotoUncheckedCreateWithoutFolderInput[]
    connectOrCreate?: PhotoCreateOrConnectWithoutFolderInput | PhotoCreateOrConnectWithoutFolderInput[]
    upsert?: PhotoUpsertWithWhereUniqueWithoutFolderInput | PhotoUpsertWithWhereUniqueWithoutFolderInput[]
    createMany?: PhotoCreateManyFolderInputEnvelope
    set?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    disconnect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    delete?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    connect?: PhotoWhereUniqueInput | PhotoWhereUniqueInput[]
    update?: PhotoUpdateWithWhereUniqueWithoutFolderInput | PhotoUpdateWithWhereUniqueWithoutFolderInput[]
    updateMany?: PhotoUpdateManyWithWhereWithoutFolderInput | PhotoUpdateManyWithWhereWithoutFolderInput[]
    deleteMany?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutPortfoliosInput = {
    create?: XOR<UserCreateWithoutPortfoliosInput, UserUncheckedCreateWithoutPortfoliosInput>
    connectOrCreate?: UserCreateOrConnectWithoutPortfoliosInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutPortfoliosNestedInput = {
    create?: XOR<UserCreateWithoutPortfoliosInput, UserUncheckedCreateWithoutPortfoliosInput>
    connectOrCreate?: UserCreateOrConnectWithoutPortfoliosInput
    upsert?: UserUpsertWithoutPortfoliosInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutPortfoliosInput, UserUpdateWithoutPortfoliosInput>, UserUncheckedUpdateWithoutPortfoliosInput>
  }

  export type UserCreateNestedOneWithoutLinksPagesInput = {
    create?: XOR<UserCreateWithoutLinksPagesInput, UserUncheckedCreateWithoutLinksPagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLinksPagesInput
    connect?: UserWhereUniqueInput
  }

  export type LinkItemCreateNestedManyWithoutLinksPageInput = {
    create?: XOR<LinkItemCreateWithoutLinksPageInput, LinkItemUncheckedCreateWithoutLinksPageInput> | LinkItemCreateWithoutLinksPageInput[] | LinkItemUncheckedCreateWithoutLinksPageInput[]
    connectOrCreate?: LinkItemCreateOrConnectWithoutLinksPageInput | LinkItemCreateOrConnectWithoutLinksPageInput[]
    createMany?: LinkItemCreateManyLinksPageInputEnvelope
    connect?: LinkItemWhereUniqueInput | LinkItemWhereUniqueInput[]
  }

  export type LinkItemUncheckedCreateNestedManyWithoutLinksPageInput = {
    create?: XOR<LinkItemCreateWithoutLinksPageInput, LinkItemUncheckedCreateWithoutLinksPageInput> | LinkItemCreateWithoutLinksPageInput[] | LinkItemUncheckedCreateWithoutLinksPageInput[]
    connectOrCreate?: LinkItemCreateOrConnectWithoutLinksPageInput | LinkItemCreateOrConnectWithoutLinksPageInput[]
    createMany?: LinkItemCreateManyLinksPageInputEnvelope
    connect?: LinkItemWhereUniqueInput | LinkItemWhereUniqueInput[]
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type UserUpdateOneRequiredWithoutLinksPagesNestedInput = {
    create?: XOR<UserCreateWithoutLinksPagesInput, UserUncheckedCreateWithoutLinksPagesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLinksPagesInput
    upsert?: UserUpsertWithoutLinksPagesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLinksPagesInput, UserUpdateWithoutLinksPagesInput>, UserUncheckedUpdateWithoutLinksPagesInput>
  }

  export type LinkItemUpdateManyWithoutLinksPageNestedInput = {
    create?: XOR<LinkItemCreateWithoutLinksPageInput, LinkItemUncheckedCreateWithoutLinksPageInput> | LinkItemCreateWithoutLinksPageInput[] | LinkItemUncheckedCreateWithoutLinksPageInput[]
    connectOrCreate?: LinkItemCreateOrConnectWithoutLinksPageInput | LinkItemCreateOrConnectWithoutLinksPageInput[]
    upsert?: LinkItemUpsertWithWhereUniqueWithoutLinksPageInput | LinkItemUpsertWithWhereUniqueWithoutLinksPageInput[]
    createMany?: LinkItemCreateManyLinksPageInputEnvelope
    set?: LinkItemWhereUniqueInput | LinkItemWhereUniqueInput[]
    disconnect?: LinkItemWhereUniqueInput | LinkItemWhereUniqueInput[]
    delete?: LinkItemWhereUniqueInput | LinkItemWhereUniqueInput[]
    connect?: LinkItemWhereUniqueInput | LinkItemWhereUniqueInput[]
    update?: LinkItemUpdateWithWhereUniqueWithoutLinksPageInput | LinkItemUpdateWithWhereUniqueWithoutLinksPageInput[]
    updateMany?: LinkItemUpdateManyWithWhereWithoutLinksPageInput | LinkItemUpdateManyWithWhereWithoutLinksPageInput[]
    deleteMany?: LinkItemScalarWhereInput | LinkItemScalarWhereInput[]
  }

  export type LinkItemUncheckedUpdateManyWithoutLinksPageNestedInput = {
    create?: XOR<LinkItemCreateWithoutLinksPageInput, LinkItemUncheckedCreateWithoutLinksPageInput> | LinkItemCreateWithoutLinksPageInput[] | LinkItemUncheckedCreateWithoutLinksPageInput[]
    connectOrCreate?: LinkItemCreateOrConnectWithoutLinksPageInput | LinkItemCreateOrConnectWithoutLinksPageInput[]
    upsert?: LinkItemUpsertWithWhereUniqueWithoutLinksPageInput | LinkItemUpsertWithWhereUniqueWithoutLinksPageInput[]
    createMany?: LinkItemCreateManyLinksPageInputEnvelope
    set?: LinkItemWhereUniqueInput | LinkItemWhereUniqueInput[]
    disconnect?: LinkItemWhereUniqueInput | LinkItemWhereUniqueInput[]
    delete?: LinkItemWhereUniqueInput | LinkItemWhereUniqueInput[]
    connect?: LinkItemWhereUniqueInput | LinkItemWhereUniqueInput[]
    update?: LinkItemUpdateWithWhereUniqueWithoutLinksPageInput | LinkItemUpdateWithWhereUniqueWithoutLinksPageInput[]
    updateMany?: LinkItemUpdateManyWithWhereWithoutLinksPageInput | LinkItemUpdateManyWithWhereWithoutLinksPageInput[]
    deleteMany?: LinkItemScalarWhereInput | LinkItemScalarWhereInput[]
  }

  export type LinksPageCreateNestedOneWithoutLinksInput = {
    create?: XOR<LinksPageCreateWithoutLinksInput, LinksPageUncheckedCreateWithoutLinksInput>
    connectOrCreate?: LinksPageCreateOrConnectWithoutLinksInput
    connect?: LinksPageWhereUniqueInput
  }

  export type LinksPageUpdateOneRequiredWithoutLinksNestedInput = {
    create?: XOR<LinksPageCreateWithoutLinksInput, LinksPageUncheckedCreateWithoutLinksInput>
    connectOrCreate?: LinksPageCreateOrConnectWithoutLinksInput
    upsert?: LinksPageUpsertWithoutLinksInput
    connect?: LinksPageWhereUniqueInput
    update?: XOR<XOR<LinksPageUpdateToOneWithWhereWithoutLinksInput, LinksPageUpdateWithoutLinksInput>, LinksPageUncheckedUpdateWithoutLinksInput>
  }

  export type DeliveryCreatewhitelistInput = {
    set: string[]
  }

  export type UserCreateNestedOneWithoutDeliveriesInput = {
    create?: XOR<UserCreateWithoutDeliveriesInput, UserUncheckedCreateWithoutDeliveriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDeliveriesInput
    connect?: UserWhereUniqueInput
  }

  export type DeliveryPhotoCreateNestedManyWithoutDeliveryInput = {
    create?: XOR<DeliveryPhotoCreateWithoutDeliveryInput, DeliveryPhotoUncheckedCreateWithoutDeliveryInput> | DeliveryPhotoCreateWithoutDeliveryInput[] | DeliveryPhotoUncheckedCreateWithoutDeliveryInput[]
    connectOrCreate?: DeliveryPhotoCreateOrConnectWithoutDeliveryInput | DeliveryPhotoCreateOrConnectWithoutDeliveryInput[]
    createMany?: DeliveryPhotoCreateManyDeliveryInputEnvelope
    connect?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
  }

  export type DeliveryPhotoUncheckedCreateNestedManyWithoutDeliveryInput = {
    create?: XOR<DeliveryPhotoCreateWithoutDeliveryInput, DeliveryPhotoUncheckedCreateWithoutDeliveryInput> | DeliveryPhotoCreateWithoutDeliveryInput[] | DeliveryPhotoUncheckedCreateWithoutDeliveryInput[]
    connectOrCreate?: DeliveryPhotoCreateOrConnectWithoutDeliveryInput | DeliveryPhotoCreateOrConnectWithoutDeliveryInput[]
    createMany?: DeliveryPhotoCreateManyDeliveryInputEnvelope
    connect?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
  }

  export type DeliveryUpdatewhitelistInput = {
    set?: string[]
    push?: string | string[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type UserUpdateOneRequiredWithoutDeliveriesNestedInput = {
    create?: XOR<UserCreateWithoutDeliveriesInput, UserUncheckedCreateWithoutDeliveriesInput>
    connectOrCreate?: UserCreateOrConnectWithoutDeliveriesInput
    upsert?: UserUpsertWithoutDeliveriesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDeliveriesInput, UserUpdateWithoutDeliveriesInput>, UserUncheckedUpdateWithoutDeliveriesInput>
  }

  export type DeliveryPhotoUpdateManyWithoutDeliveryNestedInput = {
    create?: XOR<DeliveryPhotoCreateWithoutDeliveryInput, DeliveryPhotoUncheckedCreateWithoutDeliveryInput> | DeliveryPhotoCreateWithoutDeliveryInput[] | DeliveryPhotoUncheckedCreateWithoutDeliveryInput[]
    connectOrCreate?: DeliveryPhotoCreateOrConnectWithoutDeliveryInput | DeliveryPhotoCreateOrConnectWithoutDeliveryInput[]
    upsert?: DeliveryPhotoUpsertWithWhereUniqueWithoutDeliveryInput | DeliveryPhotoUpsertWithWhereUniqueWithoutDeliveryInput[]
    createMany?: DeliveryPhotoCreateManyDeliveryInputEnvelope
    set?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    disconnect?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    delete?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    connect?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    update?: DeliveryPhotoUpdateWithWhereUniqueWithoutDeliveryInput | DeliveryPhotoUpdateWithWhereUniqueWithoutDeliveryInput[]
    updateMany?: DeliveryPhotoUpdateManyWithWhereWithoutDeliveryInput | DeliveryPhotoUpdateManyWithWhereWithoutDeliveryInput[]
    deleteMany?: DeliveryPhotoScalarWhereInput | DeliveryPhotoScalarWhereInput[]
  }

  export type DeliveryPhotoUncheckedUpdateManyWithoutDeliveryNestedInput = {
    create?: XOR<DeliveryPhotoCreateWithoutDeliveryInput, DeliveryPhotoUncheckedCreateWithoutDeliveryInput> | DeliveryPhotoCreateWithoutDeliveryInput[] | DeliveryPhotoUncheckedCreateWithoutDeliveryInput[]
    connectOrCreate?: DeliveryPhotoCreateOrConnectWithoutDeliveryInput | DeliveryPhotoCreateOrConnectWithoutDeliveryInput[]
    upsert?: DeliveryPhotoUpsertWithWhereUniqueWithoutDeliveryInput | DeliveryPhotoUpsertWithWhereUniqueWithoutDeliveryInput[]
    createMany?: DeliveryPhotoCreateManyDeliveryInputEnvelope
    set?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    disconnect?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    delete?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    connect?: DeliveryPhotoWhereUniqueInput | DeliveryPhotoWhereUniqueInput[]
    update?: DeliveryPhotoUpdateWithWhereUniqueWithoutDeliveryInput | DeliveryPhotoUpdateWithWhereUniqueWithoutDeliveryInput[]
    updateMany?: DeliveryPhotoUpdateManyWithWhereWithoutDeliveryInput | DeliveryPhotoUpdateManyWithWhereWithoutDeliveryInput[]
    deleteMany?: DeliveryPhotoScalarWhereInput | DeliveryPhotoScalarWhereInput[]
  }

  export type DeliveryCreateNestedOneWithoutPhotosInput = {
    create?: XOR<DeliveryCreateWithoutPhotosInput, DeliveryUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: DeliveryCreateOrConnectWithoutPhotosInput
    connect?: DeliveryWhereUniqueInput
  }

  export type PhotoCreateNestedOneWithoutDeliveryPhotosInput = {
    create?: XOR<PhotoCreateWithoutDeliveryPhotosInput, PhotoUncheckedCreateWithoutDeliveryPhotosInput>
    connectOrCreate?: PhotoCreateOrConnectWithoutDeliveryPhotosInput
    connect?: PhotoWhereUniqueInput
  }

  export type DeliveryUpdateOneRequiredWithoutPhotosNestedInput = {
    create?: XOR<DeliveryCreateWithoutPhotosInput, DeliveryUncheckedCreateWithoutPhotosInput>
    connectOrCreate?: DeliveryCreateOrConnectWithoutPhotosInput
    upsert?: DeliveryUpsertWithoutPhotosInput
    connect?: DeliveryWhereUniqueInput
    update?: XOR<XOR<DeliveryUpdateToOneWithWhereWithoutPhotosInput, DeliveryUpdateWithoutPhotosInput>, DeliveryUncheckedUpdateWithoutPhotosInput>
  }

  export type PhotoUpdateOneRequiredWithoutDeliveryPhotosNestedInput = {
    create?: XOR<PhotoCreateWithoutDeliveryPhotosInput, PhotoUncheckedCreateWithoutDeliveryPhotosInput>
    connectOrCreate?: PhotoCreateOrConnectWithoutDeliveryPhotosInput
    upsert?: PhotoUpsertWithoutDeliveryPhotosInput
    connect?: PhotoWhereUniqueInput
    update?: XOR<XOR<PhotoUpdateToOneWithWhereWithoutDeliveryPhotosInput, PhotoUpdateWithoutDeliveryPhotosInput>, PhotoUncheckedUpdateWithoutDeliveryPhotosInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string[]
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    lte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gt?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    gte?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type PhotoCreateWithoutUserInput = {
    id?: string
    url: string
    storagePath: string
    filename: string
    size: number
    width?: number | null
    height?: number | null
    mimeType?: string
    hasPreview?: boolean
    createdAt?: Date | string
    folder?: PhotoFolderCreateNestedOneWithoutPhotosInput
    deliveryPhotos?: DeliveryPhotoCreateNestedManyWithoutPhotoInput
  }

  export type PhotoUncheckedCreateWithoutUserInput = {
    id?: string
    url: string
    storagePath: string
    filename: string
    size: number
    width?: number | null
    height?: number | null
    mimeType?: string
    hasPreview?: boolean
    createdAt?: Date | string
    folderId?: string | null
    deliveryPhotos?: DeliveryPhotoUncheckedCreateNestedManyWithoutPhotoInput
  }

  export type PhotoCreateOrConnectWithoutUserInput = {
    where: PhotoWhereUniqueInput
    create: XOR<PhotoCreateWithoutUserInput, PhotoUncheckedCreateWithoutUserInput>
  }

  export type PhotoCreateManyUserInputEnvelope = {
    data: PhotoCreateManyUserInput | PhotoCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PhotoFolderCreateWithoutUserInput = {
    id?: string
    name: string
    createdAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutFolderInput
  }

  export type PhotoFolderUncheckedCreateWithoutUserInput = {
    id?: string
    name: string
    createdAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutFolderInput
  }

  export type PhotoFolderCreateOrConnectWithoutUserInput = {
    where: PhotoFolderWhereUniqueInput
    create: XOR<PhotoFolderCreateWithoutUserInput, PhotoFolderUncheckedCreateWithoutUserInput>
  }

  export type PhotoFolderCreateManyUserInputEnvelope = {
    data: PhotoFolderCreateManyUserInput | PhotoFolderCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PortfolioCreateWithoutUserInput = {
    id?: string
    title: string
    slug: string
    status?: string
    template?: string
    customDomain?: string | null
    content?: JsonNullValueInput | InputJsonValue
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PortfolioUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    slug: string
    status?: string
    template?: string
    customDomain?: string | null
    content?: JsonNullValueInput | InputJsonValue
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type PortfolioCreateOrConnectWithoutUserInput = {
    where: PortfolioWhereUniqueInput
    create: XOR<PortfolioCreateWithoutUserInput, PortfolioUncheckedCreateWithoutUserInput>
  }

  export type PortfolioCreateManyUserInputEnvelope = {
    data: PortfolioCreateManyUserInput | PortfolioCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type LinksPageCreateWithoutUserInput = {
    id?: string
    template?: string
    displayName?: string
    bio?: string
    avatarUrl?: string
    avatarBg?: string
    avatarInitial?: string
    bgType?: string
    bgColor?: string
    bgGradFrom?: string
    bgGradTo?: string
    bgGradAngle?: number
    bgImageUrl?: string
    bgOverlayColor?: string
    bgOverlayOpacity?: number
    btnShape?: string
    btnVariant?: string
    btnBg?: string
    btnText?: string
    btnBorder?: string
    fontFamily?: string
    fontWeight?: string
    textColor?: string
    subColor?: string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    links?: LinkItemCreateNestedManyWithoutLinksPageInput
  }

  export type LinksPageUncheckedCreateWithoutUserInput = {
    id?: string
    template?: string
    displayName?: string
    bio?: string
    avatarUrl?: string
    avatarBg?: string
    avatarInitial?: string
    bgType?: string
    bgColor?: string
    bgGradFrom?: string
    bgGradTo?: string
    bgGradAngle?: number
    bgImageUrl?: string
    bgOverlayColor?: string
    bgOverlayOpacity?: number
    btnShape?: string
    btnVariant?: string
    btnBg?: string
    btnText?: string
    btnBorder?: string
    fontFamily?: string
    fontWeight?: string
    textColor?: string
    subColor?: string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    links?: LinkItemUncheckedCreateNestedManyWithoutLinksPageInput
  }

  export type LinksPageCreateOrConnectWithoutUserInput = {
    where: LinksPageWhereUniqueInput
    create: XOR<LinksPageCreateWithoutUserInput, LinksPageUncheckedCreateWithoutUserInput>
  }

  export type LinksPageCreateManyUserInputEnvelope = {
    data: LinksPageCreateManyUserInput | LinksPageCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type DeliveryCreateWithoutUserInput = {
    id?: string
    title?: string
    client?: string
    status?: string
    template?: string
    layout?: string
    coverUrl?: string
    coverFit?: string
    coverPositionX?: number
    coverPositionY?: number
    passwordEnabled?: boolean
    password?: string
    whitelistEnabled?: boolean
    whitelist?: DeliveryCreatewhitelistInput | string[]
    passwordTitle?: string
    passwordSubtitle?: string
    passwordHint?: string
    passwordButtonLabel?: string
    mode?: string
    pricePerPhoto?: number
    priceFullGallery?: number
    downloadRes?: string
    logoMode?: string
    logoText?: string
    logoUrl?: string
    logoWidth?: number
    customColors?: boolean
    colorBg?: string
    colorFg?: string
    colorAccent?: string
    colorBtnBg?: string
    colorBtnFg?: string
    fontFamily?: string
    fontFamily1?: string
    fontFamily2?: string
    fontFamily3?: string
    welcomeMessage?: string
    showUpsellBanner?: boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    views?: number
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: DeliveryPhotoCreateNestedManyWithoutDeliveryInput
  }

  export type DeliveryUncheckedCreateWithoutUserInput = {
    id?: string
    title?: string
    client?: string
    status?: string
    template?: string
    layout?: string
    coverUrl?: string
    coverFit?: string
    coverPositionX?: number
    coverPositionY?: number
    passwordEnabled?: boolean
    password?: string
    whitelistEnabled?: boolean
    whitelist?: DeliveryCreatewhitelistInput | string[]
    passwordTitle?: string
    passwordSubtitle?: string
    passwordHint?: string
    passwordButtonLabel?: string
    mode?: string
    pricePerPhoto?: number
    priceFullGallery?: number
    downloadRes?: string
    logoMode?: string
    logoText?: string
    logoUrl?: string
    logoWidth?: number
    customColors?: boolean
    colorBg?: string
    colorFg?: string
    colorAccent?: string
    colorBtnBg?: string
    colorBtnFg?: string
    fontFamily?: string
    fontFamily1?: string
    fontFamily2?: string
    fontFamily3?: string
    welcomeMessage?: string
    showUpsellBanner?: boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    views?: number
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: DeliveryPhotoUncheckedCreateNestedManyWithoutDeliveryInput
  }

  export type DeliveryCreateOrConnectWithoutUserInput = {
    where: DeliveryWhereUniqueInput
    create: XOR<DeliveryCreateWithoutUserInput, DeliveryUncheckedCreateWithoutUserInput>
  }

  export type DeliveryCreateManyUserInputEnvelope = {
    data: DeliveryCreateManyUserInput | DeliveryCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type MessageCreateWithoutUserInput = {
    id?: string
    authorName?: string
    body: string
    createdAt?: Date | string
  }

  export type MessageUncheckedCreateWithoutUserInput = {
    id?: string
    authorName?: string
    body: string
    createdAt?: Date | string
  }

  export type MessageCreateOrConnectWithoutUserInput = {
    where: MessageWhereUniqueInput
    create: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput>
  }

  export type MessageCreateManyUserInputEnvelope = {
    data: MessageCreateManyUserInput | MessageCreateManyUserInput[]
    skipDuplicates?: boolean
  }

  export type PhotoUpsertWithWhereUniqueWithoutUserInput = {
    where: PhotoWhereUniqueInput
    update: XOR<PhotoUpdateWithoutUserInput, PhotoUncheckedUpdateWithoutUserInput>
    create: XOR<PhotoCreateWithoutUserInput, PhotoUncheckedCreateWithoutUserInput>
  }

  export type PhotoUpdateWithWhereUniqueWithoutUserInput = {
    where: PhotoWhereUniqueInput
    data: XOR<PhotoUpdateWithoutUserInput, PhotoUncheckedUpdateWithoutUserInput>
  }

  export type PhotoUpdateManyWithWhereWithoutUserInput = {
    where: PhotoScalarWhereInput
    data: XOR<PhotoUpdateManyMutationInput, PhotoUncheckedUpdateManyWithoutUserInput>
  }

  export type PhotoScalarWhereInput = {
    AND?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
    OR?: PhotoScalarWhereInput[]
    NOT?: PhotoScalarWhereInput | PhotoScalarWhereInput[]
    id?: StringFilter<"Photo"> | string
    userId?: StringFilter<"Photo"> | string
    url?: StringFilter<"Photo"> | string
    storagePath?: StringFilter<"Photo"> | string
    filename?: StringFilter<"Photo"> | string
    size?: IntFilter<"Photo"> | number
    width?: IntNullableFilter<"Photo"> | number | null
    height?: IntNullableFilter<"Photo"> | number | null
    mimeType?: StringFilter<"Photo"> | string
    hasPreview?: BoolFilter<"Photo"> | boolean
    createdAt?: DateTimeFilter<"Photo"> | Date | string
    folderId?: StringNullableFilter<"Photo"> | string | null
  }

  export type PhotoFolderUpsertWithWhereUniqueWithoutUserInput = {
    where: PhotoFolderWhereUniqueInput
    update: XOR<PhotoFolderUpdateWithoutUserInput, PhotoFolderUncheckedUpdateWithoutUserInput>
    create: XOR<PhotoFolderCreateWithoutUserInput, PhotoFolderUncheckedCreateWithoutUserInput>
  }

  export type PhotoFolderUpdateWithWhereUniqueWithoutUserInput = {
    where: PhotoFolderWhereUniqueInput
    data: XOR<PhotoFolderUpdateWithoutUserInput, PhotoFolderUncheckedUpdateWithoutUserInput>
  }

  export type PhotoFolderUpdateManyWithWhereWithoutUserInput = {
    where: PhotoFolderScalarWhereInput
    data: XOR<PhotoFolderUpdateManyMutationInput, PhotoFolderUncheckedUpdateManyWithoutUserInput>
  }

  export type PhotoFolderScalarWhereInput = {
    AND?: PhotoFolderScalarWhereInput | PhotoFolderScalarWhereInput[]
    OR?: PhotoFolderScalarWhereInput[]
    NOT?: PhotoFolderScalarWhereInput | PhotoFolderScalarWhereInput[]
    id?: StringFilter<"PhotoFolder"> | string
    userId?: StringFilter<"PhotoFolder"> | string
    name?: StringFilter<"PhotoFolder"> | string
    createdAt?: DateTimeFilter<"PhotoFolder"> | Date | string
  }

  export type PortfolioUpsertWithWhereUniqueWithoutUserInput = {
    where: PortfolioWhereUniqueInput
    update: XOR<PortfolioUpdateWithoutUserInput, PortfolioUncheckedUpdateWithoutUserInput>
    create: XOR<PortfolioCreateWithoutUserInput, PortfolioUncheckedCreateWithoutUserInput>
  }

  export type PortfolioUpdateWithWhereUniqueWithoutUserInput = {
    where: PortfolioWhereUniqueInput
    data: XOR<PortfolioUpdateWithoutUserInput, PortfolioUncheckedUpdateWithoutUserInput>
  }

  export type PortfolioUpdateManyWithWhereWithoutUserInput = {
    where: PortfolioScalarWhereInput
    data: XOR<PortfolioUpdateManyMutationInput, PortfolioUncheckedUpdateManyWithoutUserInput>
  }

  export type PortfolioScalarWhereInput = {
    AND?: PortfolioScalarWhereInput | PortfolioScalarWhereInput[]
    OR?: PortfolioScalarWhereInput[]
    NOT?: PortfolioScalarWhereInput | PortfolioScalarWhereInput[]
    id?: StringFilter<"Portfolio"> | string
    userId?: StringFilter<"Portfolio"> | string
    title?: StringFilter<"Portfolio"> | string
    slug?: StringFilter<"Portfolio"> | string
    status?: StringFilter<"Portfolio"> | string
    template?: StringFilter<"Portfolio"> | string
    customDomain?: StringNullableFilter<"Portfolio"> | string | null
    content?: JsonFilter<"Portfolio">
    views?: IntFilter<"Portfolio"> | number
    createdAt?: DateTimeFilter<"Portfolio"> | Date | string
    updatedAt?: DateTimeFilter<"Portfolio"> | Date | string
  }

  export type LinksPageUpsertWithWhereUniqueWithoutUserInput = {
    where: LinksPageWhereUniqueInput
    update: XOR<LinksPageUpdateWithoutUserInput, LinksPageUncheckedUpdateWithoutUserInput>
    create: XOR<LinksPageCreateWithoutUserInput, LinksPageUncheckedCreateWithoutUserInput>
  }

  export type LinksPageUpdateWithWhereUniqueWithoutUserInput = {
    where: LinksPageWhereUniqueInput
    data: XOR<LinksPageUpdateWithoutUserInput, LinksPageUncheckedUpdateWithoutUserInput>
  }

  export type LinksPageUpdateManyWithWhereWithoutUserInput = {
    where: LinksPageScalarWhereInput
    data: XOR<LinksPageUpdateManyMutationInput, LinksPageUncheckedUpdateManyWithoutUserInput>
  }

  export type LinksPageScalarWhereInput = {
    AND?: LinksPageScalarWhereInput | LinksPageScalarWhereInput[]
    OR?: LinksPageScalarWhereInput[]
    NOT?: LinksPageScalarWhereInput | LinksPageScalarWhereInput[]
    id?: StringFilter<"LinksPage"> | string
    userId?: StringFilter<"LinksPage"> | string
    template?: StringFilter<"LinksPage"> | string
    displayName?: StringFilter<"LinksPage"> | string
    bio?: StringFilter<"LinksPage"> | string
    avatarUrl?: StringFilter<"LinksPage"> | string
    avatarBg?: StringFilter<"LinksPage"> | string
    avatarInitial?: StringFilter<"LinksPage"> | string
    bgType?: StringFilter<"LinksPage"> | string
    bgColor?: StringFilter<"LinksPage"> | string
    bgGradFrom?: StringFilter<"LinksPage"> | string
    bgGradTo?: StringFilter<"LinksPage"> | string
    bgGradAngle?: IntFilter<"LinksPage"> | number
    bgImageUrl?: StringFilter<"LinksPage"> | string
    bgOverlayColor?: StringFilter<"LinksPage"> | string
    bgOverlayOpacity?: FloatFilter<"LinksPage"> | number
    btnShape?: StringFilter<"LinksPage"> | string
    btnVariant?: StringFilter<"LinksPage"> | string
    btnBg?: StringFilter<"LinksPage"> | string
    btnText?: StringFilter<"LinksPage"> | string
    btnBorder?: StringFilter<"LinksPage"> | string
    fontFamily?: StringFilter<"LinksPage"> | string
    fontWeight?: StringFilter<"LinksPage"> | string
    textColor?: StringFilter<"LinksPage"> | string
    subColor?: StringFilter<"LinksPage"> | string
    labels?: JsonFilter<"LinksPage">
    slug?: StringNullableFilter<"LinksPage"> | string | null
    published?: BoolFilter<"LinksPage"> | boolean
    createdAt?: DateTimeFilter<"LinksPage"> | Date | string
    updatedAt?: DateTimeFilter<"LinksPage"> | Date | string
  }

  export type DeliveryUpsertWithWhereUniqueWithoutUserInput = {
    where: DeliveryWhereUniqueInput
    update: XOR<DeliveryUpdateWithoutUserInput, DeliveryUncheckedUpdateWithoutUserInput>
    create: XOR<DeliveryCreateWithoutUserInput, DeliveryUncheckedCreateWithoutUserInput>
  }

  export type DeliveryUpdateWithWhereUniqueWithoutUserInput = {
    where: DeliveryWhereUniqueInput
    data: XOR<DeliveryUpdateWithoutUserInput, DeliveryUncheckedUpdateWithoutUserInput>
  }

  export type DeliveryUpdateManyWithWhereWithoutUserInput = {
    where: DeliveryScalarWhereInput
    data: XOR<DeliveryUpdateManyMutationInput, DeliveryUncheckedUpdateManyWithoutUserInput>
  }

  export type DeliveryScalarWhereInput = {
    AND?: DeliveryScalarWhereInput | DeliveryScalarWhereInput[]
    OR?: DeliveryScalarWhereInput[]
    NOT?: DeliveryScalarWhereInput | DeliveryScalarWhereInput[]
    id?: StringFilter<"Delivery"> | string
    userId?: StringFilter<"Delivery"> | string
    title?: StringFilter<"Delivery"> | string
    client?: StringFilter<"Delivery"> | string
    status?: StringFilter<"Delivery"> | string
    template?: StringFilter<"Delivery"> | string
    layout?: StringFilter<"Delivery"> | string
    coverUrl?: StringFilter<"Delivery"> | string
    coverFit?: StringFilter<"Delivery"> | string
    coverPositionX?: FloatFilter<"Delivery"> | number
    coverPositionY?: FloatFilter<"Delivery"> | number
    passwordEnabled?: BoolFilter<"Delivery"> | boolean
    password?: StringFilter<"Delivery"> | string
    whitelistEnabled?: BoolFilter<"Delivery"> | boolean
    whitelist?: StringNullableListFilter<"Delivery">
    passwordTitle?: StringFilter<"Delivery"> | string
    passwordSubtitle?: StringFilter<"Delivery"> | string
    passwordHint?: StringFilter<"Delivery"> | string
    passwordButtonLabel?: StringFilter<"Delivery"> | string
    mode?: StringFilter<"Delivery"> | string
    pricePerPhoto?: FloatFilter<"Delivery"> | number
    priceFullGallery?: FloatFilter<"Delivery"> | number
    downloadRes?: StringFilter<"Delivery"> | string
    logoMode?: StringFilter<"Delivery"> | string
    logoText?: StringFilter<"Delivery"> | string
    logoUrl?: StringFilter<"Delivery"> | string
    logoWidth?: IntFilter<"Delivery"> | number
    customColors?: BoolFilter<"Delivery"> | boolean
    colorBg?: StringFilter<"Delivery"> | string
    colorFg?: StringFilter<"Delivery"> | string
    colorAccent?: StringFilter<"Delivery"> | string
    colorBtnBg?: StringFilter<"Delivery"> | string
    colorBtnFg?: StringFilter<"Delivery"> | string
    fontFamily?: StringFilter<"Delivery"> | string
    fontFamily1?: StringFilter<"Delivery"> | string
    fontFamily2?: StringFilter<"Delivery"> | string
    fontFamily3?: StringFilter<"Delivery"> | string
    welcomeMessage?: StringFilter<"Delivery"> | string
    showUpsellBanner?: BoolFilter<"Delivery"> | boolean
    labels?: JsonFilter<"Delivery">
    slug?: StringNullableFilter<"Delivery"> | string | null
    views?: IntFilter<"Delivery"> | number
    expiresAt?: DateTimeNullableFilter<"Delivery"> | Date | string | null
    createdAt?: DateTimeFilter<"Delivery"> | Date | string
    updatedAt?: DateTimeFilter<"Delivery"> | Date | string
  }

  export type MessageUpsertWithWhereUniqueWithoutUserInput = {
    where: MessageWhereUniqueInput
    update: XOR<MessageUpdateWithoutUserInput, MessageUncheckedUpdateWithoutUserInput>
    create: XOR<MessageCreateWithoutUserInput, MessageUncheckedCreateWithoutUserInput>
  }

  export type MessageUpdateWithWhereUniqueWithoutUserInput = {
    where: MessageWhereUniqueInput
    data: XOR<MessageUpdateWithoutUserInput, MessageUncheckedUpdateWithoutUserInput>
  }

  export type MessageUpdateManyWithWhereWithoutUserInput = {
    where: MessageScalarWhereInput
    data: XOR<MessageUpdateManyMutationInput, MessageUncheckedUpdateManyWithoutUserInput>
  }

  export type MessageScalarWhereInput = {
    AND?: MessageScalarWhereInput | MessageScalarWhereInput[]
    OR?: MessageScalarWhereInput[]
    NOT?: MessageScalarWhereInput | MessageScalarWhereInput[]
    id?: StringFilter<"Message"> | string
    userId?: StringFilter<"Message"> | string
    authorName?: StringFilter<"Message"> | string
    body?: StringFilter<"Message"> | string
    createdAt?: DateTimeFilter<"Message"> | Date | string
  }

  export type UserCreateWithoutMessagesInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutUserInput
    photoFolders?: PhotoFolderCreateNestedManyWithoutUserInput
    portfolios?: PortfolioCreateNestedManyWithoutUserInput
    linksPages?: LinksPageCreateNestedManyWithoutUserInput
    deliveries?: DeliveryCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutMessagesInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutUserInput
    photoFolders?: PhotoFolderUncheckedCreateNestedManyWithoutUserInput
    portfolios?: PortfolioUncheckedCreateNestedManyWithoutUserInput
    linksPages?: LinksPageUncheckedCreateNestedManyWithoutUserInput
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutMessagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
  }

  export type UserUpsertWithoutMessagesInput = {
    update: XOR<UserUpdateWithoutMessagesInput, UserUncheckedUpdateWithoutMessagesInput>
    create: XOR<UserCreateWithoutMessagesInput, UserUncheckedCreateWithoutMessagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutMessagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutMessagesInput, UserUncheckedUpdateWithoutMessagesInput>
  }

  export type UserUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutUserNestedInput
    photoFolders?: PhotoFolderUpdateManyWithoutUserNestedInput
    portfolios?: PortfolioUpdateManyWithoutUserNestedInput
    linksPages?: LinksPageUpdateManyWithoutUserNestedInput
    deliveries?: DeliveryUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutUserNestedInput
    photoFolders?: PhotoFolderUncheckedUpdateManyWithoutUserNestedInput
    portfolios?: PortfolioUncheckedUpdateManyWithoutUserNestedInput
    linksPages?: LinksPageUncheckedUpdateManyWithoutUserNestedInput
    deliveries?: DeliveryUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutPhotosInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photoFolders?: PhotoFolderCreateNestedManyWithoutUserInput
    portfolios?: PortfolioCreateNestedManyWithoutUserInput
    linksPages?: LinksPageCreateNestedManyWithoutUserInput
    deliveries?: DeliveryCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPhotosInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photoFolders?: PhotoFolderUncheckedCreateNestedManyWithoutUserInput
    portfolios?: PortfolioUncheckedCreateNestedManyWithoutUserInput
    linksPages?: LinksPageUncheckedCreateNestedManyWithoutUserInput
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPhotosInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPhotosInput, UserUncheckedCreateWithoutPhotosInput>
  }

  export type PhotoFolderCreateWithoutPhotosInput = {
    id?: string
    name: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPhotoFoldersInput
  }

  export type PhotoFolderUncheckedCreateWithoutPhotosInput = {
    id?: string
    userId: string
    name: string
    createdAt?: Date | string
  }

  export type PhotoFolderCreateOrConnectWithoutPhotosInput = {
    where: PhotoFolderWhereUniqueInput
    create: XOR<PhotoFolderCreateWithoutPhotosInput, PhotoFolderUncheckedCreateWithoutPhotosInput>
  }

  export type DeliveryPhotoCreateWithoutPhotoInput = {
    id?: string
    order?: number
    delivery: DeliveryCreateNestedOneWithoutPhotosInput
  }

  export type DeliveryPhotoUncheckedCreateWithoutPhotoInput = {
    id?: string
    deliveryId: string
    order?: number
  }

  export type DeliveryPhotoCreateOrConnectWithoutPhotoInput = {
    where: DeliveryPhotoWhereUniqueInput
    create: XOR<DeliveryPhotoCreateWithoutPhotoInput, DeliveryPhotoUncheckedCreateWithoutPhotoInput>
  }

  export type DeliveryPhotoCreateManyPhotoInputEnvelope = {
    data: DeliveryPhotoCreateManyPhotoInput | DeliveryPhotoCreateManyPhotoInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutPhotosInput = {
    update: XOR<UserUpdateWithoutPhotosInput, UserUncheckedUpdateWithoutPhotosInput>
    create: XOR<UserCreateWithoutPhotosInput, UserUncheckedCreateWithoutPhotosInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPhotosInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPhotosInput, UserUncheckedUpdateWithoutPhotosInput>
  }

  export type UserUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photoFolders?: PhotoFolderUpdateManyWithoutUserNestedInput
    portfolios?: PortfolioUpdateManyWithoutUserNestedInput
    linksPages?: LinksPageUpdateManyWithoutUserNestedInput
    deliveries?: DeliveryUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photoFolders?: PhotoFolderUncheckedUpdateManyWithoutUserNestedInput
    portfolios?: PortfolioUncheckedUpdateManyWithoutUserNestedInput
    linksPages?: LinksPageUncheckedUpdateManyWithoutUserNestedInput
    deliveries?: DeliveryUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PhotoFolderUpsertWithoutPhotosInput = {
    update: XOR<PhotoFolderUpdateWithoutPhotosInput, PhotoFolderUncheckedUpdateWithoutPhotosInput>
    create: XOR<PhotoFolderCreateWithoutPhotosInput, PhotoFolderUncheckedCreateWithoutPhotosInput>
    where?: PhotoFolderWhereInput
  }

  export type PhotoFolderUpdateToOneWithWhereWithoutPhotosInput = {
    where?: PhotoFolderWhereInput
    data: XOR<PhotoFolderUpdateWithoutPhotosInput, PhotoFolderUncheckedUpdateWithoutPhotosInput>
  }

  export type PhotoFolderUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPhotoFoldersNestedInput
  }

  export type PhotoFolderUncheckedUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliveryPhotoUpsertWithWhereUniqueWithoutPhotoInput = {
    where: DeliveryPhotoWhereUniqueInput
    update: XOR<DeliveryPhotoUpdateWithoutPhotoInput, DeliveryPhotoUncheckedUpdateWithoutPhotoInput>
    create: XOR<DeliveryPhotoCreateWithoutPhotoInput, DeliveryPhotoUncheckedCreateWithoutPhotoInput>
  }

  export type DeliveryPhotoUpdateWithWhereUniqueWithoutPhotoInput = {
    where: DeliveryPhotoWhereUniqueInput
    data: XOR<DeliveryPhotoUpdateWithoutPhotoInput, DeliveryPhotoUncheckedUpdateWithoutPhotoInput>
  }

  export type DeliveryPhotoUpdateManyWithWhereWithoutPhotoInput = {
    where: DeliveryPhotoScalarWhereInput
    data: XOR<DeliveryPhotoUpdateManyMutationInput, DeliveryPhotoUncheckedUpdateManyWithoutPhotoInput>
  }

  export type DeliveryPhotoScalarWhereInput = {
    AND?: DeliveryPhotoScalarWhereInput | DeliveryPhotoScalarWhereInput[]
    OR?: DeliveryPhotoScalarWhereInput[]
    NOT?: DeliveryPhotoScalarWhereInput | DeliveryPhotoScalarWhereInput[]
    id?: StringFilter<"DeliveryPhoto"> | string
    deliveryId?: StringFilter<"DeliveryPhoto"> | string
    photoId?: StringFilter<"DeliveryPhoto"> | string
    order?: IntFilter<"DeliveryPhoto"> | number
  }

  export type UserCreateWithoutPhotoFoldersInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutUserInput
    portfolios?: PortfolioCreateNestedManyWithoutUserInput
    linksPages?: LinksPageCreateNestedManyWithoutUserInput
    deliveries?: DeliveryCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPhotoFoldersInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutUserInput
    portfolios?: PortfolioUncheckedCreateNestedManyWithoutUserInput
    linksPages?: LinksPageUncheckedCreateNestedManyWithoutUserInput
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPhotoFoldersInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPhotoFoldersInput, UserUncheckedCreateWithoutPhotoFoldersInput>
  }

  export type PhotoCreateWithoutFolderInput = {
    id?: string
    url: string
    storagePath: string
    filename: string
    size: number
    width?: number | null
    height?: number | null
    mimeType?: string
    hasPreview?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPhotosInput
    deliveryPhotos?: DeliveryPhotoCreateNestedManyWithoutPhotoInput
  }

  export type PhotoUncheckedCreateWithoutFolderInput = {
    id?: string
    userId: string
    url: string
    storagePath: string
    filename: string
    size: number
    width?: number | null
    height?: number | null
    mimeType?: string
    hasPreview?: boolean
    createdAt?: Date | string
    deliveryPhotos?: DeliveryPhotoUncheckedCreateNestedManyWithoutPhotoInput
  }

  export type PhotoCreateOrConnectWithoutFolderInput = {
    where: PhotoWhereUniqueInput
    create: XOR<PhotoCreateWithoutFolderInput, PhotoUncheckedCreateWithoutFolderInput>
  }

  export type PhotoCreateManyFolderInputEnvelope = {
    data: PhotoCreateManyFolderInput | PhotoCreateManyFolderInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutPhotoFoldersInput = {
    update: XOR<UserUpdateWithoutPhotoFoldersInput, UserUncheckedUpdateWithoutPhotoFoldersInput>
    create: XOR<UserCreateWithoutPhotoFoldersInput, UserUncheckedCreateWithoutPhotoFoldersInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPhotoFoldersInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPhotoFoldersInput, UserUncheckedUpdateWithoutPhotoFoldersInput>
  }

  export type UserUpdateWithoutPhotoFoldersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutUserNestedInput
    portfolios?: PortfolioUpdateManyWithoutUserNestedInput
    linksPages?: LinksPageUpdateManyWithoutUserNestedInput
    deliveries?: DeliveryUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPhotoFoldersInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutUserNestedInput
    portfolios?: PortfolioUncheckedUpdateManyWithoutUserNestedInput
    linksPages?: LinksPageUncheckedUpdateManyWithoutUserNestedInput
    deliveries?: DeliveryUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type PhotoUpsertWithWhereUniqueWithoutFolderInput = {
    where: PhotoWhereUniqueInput
    update: XOR<PhotoUpdateWithoutFolderInput, PhotoUncheckedUpdateWithoutFolderInput>
    create: XOR<PhotoCreateWithoutFolderInput, PhotoUncheckedCreateWithoutFolderInput>
  }

  export type PhotoUpdateWithWhereUniqueWithoutFolderInput = {
    where: PhotoWhereUniqueInput
    data: XOR<PhotoUpdateWithoutFolderInput, PhotoUncheckedUpdateWithoutFolderInput>
  }

  export type PhotoUpdateManyWithWhereWithoutFolderInput = {
    where: PhotoScalarWhereInput
    data: XOR<PhotoUpdateManyMutationInput, PhotoUncheckedUpdateManyWithoutFolderInput>
  }

  export type UserCreateWithoutPortfoliosInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutUserInput
    photoFolders?: PhotoFolderCreateNestedManyWithoutUserInput
    linksPages?: LinksPageCreateNestedManyWithoutUserInput
    deliveries?: DeliveryCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutPortfoliosInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutUserInput
    photoFolders?: PhotoFolderUncheckedCreateNestedManyWithoutUserInput
    linksPages?: LinksPageUncheckedCreateNestedManyWithoutUserInput
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutPortfoliosInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutPortfoliosInput, UserUncheckedCreateWithoutPortfoliosInput>
  }

  export type UserUpsertWithoutPortfoliosInput = {
    update: XOR<UserUpdateWithoutPortfoliosInput, UserUncheckedUpdateWithoutPortfoliosInput>
    create: XOR<UserCreateWithoutPortfoliosInput, UserUncheckedCreateWithoutPortfoliosInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutPortfoliosInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutPortfoliosInput, UserUncheckedUpdateWithoutPortfoliosInput>
  }

  export type UserUpdateWithoutPortfoliosInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutUserNestedInput
    photoFolders?: PhotoFolderUpdateManyWithoutUserNestedInput
    linksPages?: LinksPageUpdateManyWithoutUserNestedInput
    deliveries?: DeliveryUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutPortfoliosInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutUserNestedInput
    photoFolders?: PhotoFolderUncheckedUpdateManyWithoutUserNestedInput
    linksPages?: LinksPageUncheckedUpdateManyWithoutUserNestedInput
    deliveries?: DeliveryUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutLinksPagesInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutUserInput
    photoFolders?: PhotoFolderCreateNestedManyWithoutUserInput
    portfolios?: PortfolioCreateNestedManyWithoutUserInput
    deliveries?: DeliveryCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLinksPagesInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutUserInput
    photoFolders?: PhotoFolderUncheckedCreateNestedManyWithoutUserInput
    portfolios?: PortfolioUncheckedCreateNestedManyWithoutUserInput
    deliveries?: DeliveryUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLinksPagesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLinksPagesInput, UserUncheckedCreateWithoutLinksPagesInput>
  }

  export type LinkItemCreateWithoutLinksPageInput = {
    id?: string
    type?: string
    title?: string
    url?: string
    enabled?: boolean
    order?: number
    icon?: string
    waCountry?: string | null
    waPhone?: string | null
    waMessage?: string | null
    igUsername?: string | null
    emailAddress?: string | null
    emailSubject?: string | null
    createdAt?: Date | string
  }

  export type LinkItemUncheckedCreateWithoutLinksPageInput = {
    id?: string
    type?: string
    title?: string
    url?: string
    enabled?: boolean
    order?: number
    icon?: string
    waCountry?: string | null
    waPhone?: string | null
    waMessage?: string | null
    igUsername?: string | null
    emailAddress?: string | null
    emailSubject?: string | null
    createdAt?: Date | string
  }

  export type LinkItemCreateOrConnectWithoutLinksPageInput = {
    where: LinkItemWhereUniqueInput
    create: XOR<LinkItemCreateWithoutLinksPageInput, LinkItemUncheckedCreateWithoutLinksPageInput>
  }

  export type LinkItemCreateManyLinksPageInputEnvelope = {
    data: LinkItemCreateManyLinksPageInput | LinkItemCreateManyLinksPageInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutLinksPagesInput = {
    update: XOR<UserUpdateWithoutLinksPagesInput, UserUncheckedUpdateWithoutLinksPagesInput>
    create: XOR<UserCreateWithoutLinksPagesInput, UserUncheckedCreateWithoutLinksPagesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLinksPagesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLinksPagesInput, UserUncheckedUpdateWithoutLinksPagesInput>
  }

  export type UserUpdateWithoutLinksPagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutUserNestedInput
    photoFolders?: PhotoFolderUpdateManyWithoutUserNestedInput
    portfolios?: PortfolioUpdateManyWithoutUserNestedInput
    deliveries?: DeliveryUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLinksPagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutUserNestedInput
    photoFolders?: PhotoFolderUncheckedUpdateManyWithoutUserNestedInput
    portfolios?: PortfolioUncheckedUpdateManyWithoutUserNestedInput
    deliveries?: DeliveryUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type LinkItemUpsertWithWhereUniqueWithoutLinksPageInput = {
    where: LinkItemWhereUniqueInput
    update: XOR<LinkItemUpdateWithoutLinksPageInput, LinkItemUncheckedUpdateWithoutLinksPageInput>
    create: XOR<LinkItemCreateWithoutLinksPageInput, LinkItemUncheckedCreateWithoutLinksPageInput>
  }

  export type LinkItemUpdateWithWhereUniqueWithoutLinksPageInput = {
    where: LinkItemWhereUniqueInput
    data: XOR<LinkItemUpdateWithoutLinksPageInput, LinkItemUncheckedUpdateWithoutLinksPageInput>
  }

  export type LinkItemUpdateManyWithWhereWithoutLinksPageInput = {
    where: LinkItemScalarWhereInput
    data: XOR<LinkItemUpdateManyMutationInput, LinkItemUncheckedUpdateManyWithoutLinksPageInput>
  }

  export type LinkItemScalarWhereInput = {
    AND?: LinkItemScalarWhereInput | LinkItemScalarWhereInput[]
    OR?: LinkItemScalarWhereInput[]
    NOT?: LinkItemScalarWhereInput | LinkItemScalarWhereInput[]
    id?: StringFilter<"LinkItem"> | string
    linksPageId?: StringFilter<"LinkItem"> | string
    type?: StringFilter<"LinkItem"> | string
    title?: StringFilter<"LinkItem"> | string
    url?: StringFilter<"LinkItem"> | string
    enabled?: BoolFilter<"LinkItem"> | boolean
    order?: IntFilter<"LinkItem"> | number
    icon?: StringFilter<"LinkItem"> | string
    waCountry?: StringNullableFilter<"LinkItem"> | string | null
    waPhone?: StringNullableFilter<"LinkItem"> | string | null
    waMessage?: StringNullableFilter<"LinkItem"> | string | null
    igUsername?: StringNullableFilter<"LinkItem"> | string | null
    emailAddress?: StringNullableFilter<"LinkItem"> | string | null
    emailSubject?: StringNullableFilter<"LinkItem"> | string | null
    createdAt?: DateTimeFilter<"LinkItem"> | Date | string
  }

  export type LinksPageCreateWithoutLinksInput = {
    id?: string
    template?: string
    displayName?: string
    bio?: string
    avatarUrl?: string
    avatarBg?: string
    avatarInitial?: string
    bgType?: string
    bgColor?: string
    bgGradFrom?: string
    bgGradTo?: string
    bgGradAngle?: number
    bgImageUrl?: string
    bgOverlayColor?: string
    bgOverlayOpacity?: number
    btnShape?: string
    btnVariant?: string
    btnBg?: string
    btnText?: string
    btnBorder?: string
    fontFamily?: string
    fontWeight?: string
    textColor?: string
    subColor?: string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutLinksPagesInput
  }

  export type LinksPageUncheckedCreateWithoutLinksInput = {
    id?: string
    userId: string
    template?: string
    displayName?: string
    bio?: string
    avatarUrl?: string
    avatarBg?: string
    avatarInitial?: string
    bgType?: string
    bgColor?: string
    bgGradFrom?: string
    bgGradTo?: string
    bgGradAngle?: number
    bgImageUrl?: string
    bgOverlayColor?: string
    bgOverlayOpacity?: number
    btnShape?: string
    btnVariant?: string
    btnBg?: string
    btnText?: string
    btnBorder?: string
    fontFamily?: string
    fontWeight?: string
    textColor?: string
    subColor?: string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LinksPageCreateOrConnectWithoutLinksInput = {
    where: LinksPageWhereUniqueInput
    create: XOR<LinksPageCreateWithoutLinksInput, LinksPageUncheckedCreateWithoutLinksInput>
  }

  export type LinksPageUpsertWithoutLinksInput = {
    update: XOR<LinksPageUpdateWithoutLinksInput, LinksPageUncheckedUpdateWithoutLinksInput>
    create: XOR<LinksPageCreateWithoutLinksInput, LinksPageUncheckedCreateWithoutLinksInput>
    where?: LinksPageWhereInput
  }

  export type LinksPageUpdateToOneWithWhereWithoutLinksInput = {
    where?: LinksPageWhereInput
    data: XOR<LinksPageUpdateWithoutLinksInput, LinksPageUncheckedUpdateWithoutLinksInput>
  }

  export type LinksPageUpdateWithoutLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    avatarUrl?: StringFieldUpdateOperationsInput | string
    avatarBg?: StringFieldUpdateOperationsInput | string
    avatarInitial?: StringFieldUpdateOperationsInput | string
    bgType?: StringFieldUpdateOperationsInput | string
    bgColor?: StringFieldUpdateOperationsInput | string
    bgGradFrom?: StringFieldUpdateOperationsInput | string
    bgGradTo?: StringFieldUpdateOperationsInput | string
    bgGradAngle?: IntFieldUpdateOperationsInput | number
    bgImageUrl?: StringFieldUpdateOperationsInput | string
    bgOverlayColor?: StringFieldUpdateOperationsInput | string
    bgOverlayOpacity?: FloatFieldUpdateOperationsInput | number
    btnShape?: StringFieldUpdateOperationsInput | string
    btnVariant?: StringFieldUpdateOperationsInput | string
    btnBg?: StringFieldUpdateOperationsInput | string
    btnText?: StringFieldUpdateOperationsInput | string
    btnBorder?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontWeight?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    subColor?: StringFieldUpdateOperationsInput | string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLinksPagesNestedInput
  }

  export type LinksPageUncheckedUpdateWithoutLinksInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    avatarUrl?: StringFieldUpdateOperationsInput | string
    avatarBg?: StringFieldUpdateOperationsInput | string
    avatarInitial?: StringFieldUpdateOperationsInput | string
    bgType?: StringFieldUpdateOperationsInput | string
    bgColor?: StringFieldUpdateOperationsInput | string
    bgGradFrom?: StringFieldUpdateOperationsInput | string
    bgGradTo?: StringFieldUpdateOperationsInput | string
    bgGradAngle?: IntFieldUpdateOperationsInput | number
    bgImageUrl?: StringFieldUpdateOperationsInput | string
    bgOverlayColor?: StringFieldUpdateOperationsInput | string
    bgOverlayOpacity?: FloatFieldUpdateOperationsInput | number
    btnShape?: StringFieldUpdateOperationsInput | string
    btnVariant?: StringFieldUpdateOperationsInput | string
    btnBg?: StringFieldUpdateOperationsInput | string
    btnText?: StringFieldUpdateOperationsInput | string
    btnBorder?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontWeight?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    subColor?: StringFieldUpdateOperationsInput | string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserCreateWithoutDeliveriesInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoCreateNestedManyWithoutUserInput
    photoFolders?: PhotoFolderCreateNestedManyWithoutUserInput
    portfolios?: PortfolioCreateNestedManyWithoutUserInput
    linksPages?: LinksPageCreateNestedManyWithoutUserInput
    messages?: MessageCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDeliveriesInput = {
    id: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    photos?: PhotoUncheckedCreateNestedManyWithoutUserInput
    photoFolders?: PhotoFolderUncheckedCreateNestedManyWithoutUserInput
    portfolios?: PortfolioUncheckedCreateNestedManyWithoutUserInput
    linksPages?: LinksPageUncheckedCreateNestedManyWithoutUserInput
    messages?: MessageUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDeliveriesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDeliveriesInput, UserUncheckedCreateWithoutDeliveriesInput>
  }

  export type DeliveryPhotoCreateWithoutDeliveryInput = {
    id?: string
    order?: number
    photo: PhotoCreateNestedOneWithoutDeliveryPhotosInput
  }

  export type DeliveryPhotoUncheckedCreateWithoutDeliveryInput = {
    id?: string
    photoId: string
    order?: number
  }

  export type DeliveryPhotoCreateOrConnectWithoutDeliveryInput = {
    where: DeliveryPhotoWhereUniqueInput
    create: XOR<DeliveryPhotoCreateWithoutDeliveryInput, DeliveryPhotoUncheckedCreateWithoutDeliveryInput>
  }

  export type DeliveryPhotoCreateManyDeliveryInputEnvelope = {
    data: DeliveryPhotoCreateManyDeliveryInput | DeliveryPhotoCreateManyDeliveryInput[]
    skipDuplicates?: boolean
  }

  export type UserUpsertWithoutDeliveriesInput = {
    update: XOR<UserUpdateWithoutDeliveriesInput, UserUncheckedUpdateWithoutDeliveriesInput>
    create: XOR<UserCreateWithoutDeliveriesInput, UserUncheckedCreateWithoutDeliveriesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDeliveriesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDeliveriesInput, UserUncheckedUpdateWithoutDeliveriesInput>
  }

  export type UserUpdateWithoutDeliveriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutUserNestedInput
    photoFolders?: PhotoFolderUpdateManyWithoutUserNestedInput
    portfolios?: PortfolioUpdateManyWithoutUserNestedInput
    linksPages?: LinksPageUpdateManyWithoutUserNestedInput
    messages?: MessageUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDeliveriesInput = {
    id?: StringFieldUpdateOperationsInput | string
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutUserNestedInput
    photoFolders?: PhotoFolderUncheckedUpdateManyWithoutUserNestedInput
    portfolios?: PortfolioUncheckedUpdateManyWithoutUserNestedInput
    linksPages?: LinksPageUncheckedUpdateManyWithoutUserNestedInput
    messages?: MessageUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DeliveryPhotoUpsertWithWhereUniqueWithoutDeliveryInput = {
    where: DeliveryPhotoWhereUniqueInput
    update: XOR<DeliveryPhotoUpdateWithoutDeliveryInput, DeliveryPhotoUncheckedUpdateWithoutDeliveryInput>
    create: XOR<DeliveryPhotoCreateWithoutDeliveryInput, DeliveryPhotoUncheckedCreateWithoutDeliveryInput>
  }

  export type DeliveryPhotoUpdateWithWhereUniqueWithoutDeliveryInput = {
    where: DeliveryPhotoWhereUniqueInput
    data: XOR<DeliveryPhotoUpdateWithoutDeliveryInput, DeliveryPhotoUncheckedUpdateWithoutDeliveryInput>
  }

  export type DeliveryPhotoUpdateManyWithWhereWithoutDeliveryInput = {
    where: DeliveryPhotoScalarWhereInput
    data: XOR<DeliveryPhotoUpdateManyMutationInput, DeliveryPhotoUncheckedUpdateManyWithoutDeliveryInput>
  }

  export type DeliveryCreateWithoutPhotosInput = {
    id?: string
    title?: string
    client?: string
    status?: string
    template?: string
    layout?: string
    coverUrl?: string
    coverFit?: string
    coverPositionX?: number
    coverPositionY?: number
    passwordEnabled?: boolean
    password?: string
    whitelistEnabled?: boolean
    whitelist?: DeliveryCreatewhitelistInput | string[]
    passwordTitle?: string
    passwordSubtitle?: string
    passwordHint?: string
    passwordButtonLabel?: string
    mode?: string
    pricePerPhoto?: number
    priceFullGallery?: number
    downloadRes?: string
    logoMode?: string
    logoText?: string
    logoUrl?: string
    logoWidth?: number
    customColors?: boolean
    colorBg?: string
    colorFg?: string
    colorAccent?: string
    colorBtnBg?: string
    colorBtnFg?: string
    fontFamily?: string
    fontFamily1?: string
    fontFamily2?: string
    fontFamily3?: string
    welcomeMessage?: string
    showUpsellBanner?: boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    views?: number
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutDeliveriesInput
  }

  export type DeliveryUncheckedCreateWithoutPhotosInput = {
    id?: string
    userId: string
    title?: string
    client?: string
    status?: string
    template?: string
    layout?: string
    coverUrl?: string
    coverFit?: string
    coverPositionX?: number
    coverPositionY?: number
    passwordEnabled?: boolean
    password?: string
    whitelistEnabled?: boolean
    whitelist?: DeliveryCreatewhitelistInput | string[]
    passwordTitle?: string
    passwordSubtitle?: string
    passwordHint?: string
    passwordButtonLabel?: string
    mode?: string
    pricePerPhoto?: number
    priceFullGallery?: number
    downloadRes?: string
    logoMode?: string
    logoText?: string
    logoUrl?: string
    logoWidth?: number
    customColors?: boolean
    colorBg?: string
    colorFg?: string
    colorAccent?: string
    colorBtnBg?: string
    colorBtnFg?: string
    fontFamily?: string
    fontFamily1?: string
    fontFamily2?: string
    fontFamily3?: string
    welcomeMessage?: string
    showUpsellBanner?: boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    views?: number
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeliveryCreateOrConnectWithoutPhotosInput = {
    where: DeliveryWhereUniqueInput
    create: XOR<DeliveryCreateWithoutPhotosInput, DeliveryUncheckedCreateWithoutPhotosInput>
  }

  export type PhotoCreateWithoutDeliveryPhotosInput = {
    id?: string
    url: string
    storagePath: string
    filename: string
    size: number
    width?: number | null
    height?: number | null
    mimeType?: string
    hasPreview?: boolean
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutPhotosInput
    folder?: PhotoFolderCreateNestedOneWithoutPhotosInput
  }

  export type PhotoUncheckedCreateWithoutDeliveryPhotosInput = {
    id?: string
    userId: string
    url: string
    storagePath: string
    filename: string
    size: number
    width?: number | null
    height?: number | null
    mimeType?: string
    hasPreview?: boolean
    createdAt?: Date | string
    folderId?: string | null
  }

  export type PhotoCreateOrConnectWithoutDeliveryPhotosInput = {
    where: PhotoWhereUniqueInput
    create: XOR<PhotoCreateWithoutDeliveryPhotosInput, PhotoUncheckedCreateWithoutDeliveryPhotosInput>
  }

  export type DeliveryUpsertWithoutPhotosInput = {
    update: XOR<DeliveryUpdateWithoutPhotosInput, DeliveryUncheckedUpdateWithoutPhotosInput>
    create: XOR<DeliveryCreateWithoutPhotosInput, DeliveryUncheckedCreateWithoutPhotosInput>
    where?: DeliveryWhereInput
  }

  export type DeliveryUpdateToOneWithWhereWithoutPhotosInput = {
    where?: DeliveryWhereInput
    data: XOR<DeliveryUpdateWithoutPhotosInput, DeliveryUncheckedUpdateWithoutPhotosInput>
  }

  export type DeliveryUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    client?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    layout?: StringFieldUpdateOperationsInput | string
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverFit?: StringFieldUpdateOperationsInput | string
    coverPositionX?: FloatFieldUpdateOperationsInput | number
    coverPositionY?: FloatFieldUpdateOperationsInput | number
    passwordEnabled?: BoolFieldUpdateOperationsInput | boolean
    password?: StringFieldUpdateOperationsInput | string
    whitelistEnabled?: BoolFieldUpdateOperationsInput | boolean
    whitelist?: DeliveryUpdatewhitelistInput | string[]
    passwordTitle?: StringFieldUpdateOperationsInput | string
    passwordSubtitle?: StringFieldUpdateOperationsInput | string
    passwordHint?: StringFieldUpdateOperationsInput | string
    passwordButtonLabel?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pricePerPhoto?: FloatFieldUpdateOperationsInput | number
    priceFullGallery?: FloatFieldUpdateOperationsInput | number
    downloadRes?: StringFieldUpdateOperationsInput | string
    logoMode?: StringFieldUpdateOperationsInput | string
    logoText?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    logoWidth?: IntFieldUpdateOperationsInput | number
    customColors?: BoolFieldUpdateOperationsInput | boolean
    colorBg?: StringFieldUpdateOperationsInput | string
    colorFg?: StringFieldUpdateOperationsInput | string
    colorAccent?: StringFieldUpdateOperationsInput | string
    colorBtnBg?: StringFieldUpdateOperationsInput | string
    colorBtnFg?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontFamily1?: StringFieldUpdateOperationsInput | string
    fontFamily2?: StringFieldUpdateOperationsInput | string
    fontFamily3?: StringFieldUpdateOperationsInput | string
    welcomeMessage?: StringFieldUpdateOperationsInput | string
    showUpsellBanner?: BoolFieldUpdateOperationsInput | boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDeliveriesNestedInput
  }

  export type DeliveryUncheckedUpdateWithoutPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    client?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    layout?: StringFieldUpdateOperationsInput | string
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverFit?: StringFieldUpdateOperationsInput | string
    coverPositionX?: FloatFieldUpdateOperationsInput | number
    coverPositionY?: FloatFieldUpdateOperationsInput | number
    passwordEnabled?: BoolFieldUpdateOperationsInput | boolean
    password?: StringFieldUpdateOperationsInput | string
    whitelistEnabled?: BoolFieldUpdateOperationsInput | boolean
    whitelist?: DeliveryUpdatewhitelistInput | string[]
    passwordTitle?: StringFieldUpdateOperationsInput | string
    passwordSubtitle?: StringFieldUpdateOperationsInput | string
    passwordHint?: StringFieldUpdateOperationsInput | string
    passwordButtonLabel?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pricePerPhoto?: FloatFieldUpdateOperationsInput | number
    priceFullGallery?: FloatFieldUpdateOperationsInput | number
    downloadRes?: StringFieldUpdateOperationsInput | string
    logoMode?: StringFieldUpdateOperationsInput | string
    logoText?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    logoWidth?: IntFieldUpdateOperationsInput | number
    customColors?: BoolFieldUpdateOperationsInput | boolean
    colorBg?: StringFieldUpdateOperationsInput | string
    colorFg?: StringFieldUpdateOperationsInput | string
    colorAccent?: StringFieldUpdateOperationsInput | string
    colorBtnBg?: StringFieldUpdateOperationsInput | string
    colorBtnFg?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontFamily1?: StringFieldUpdateOperationsInput | string
    fontFamily2?: StringFieldUpdateOperationsInput | string
    fontFamily3?: StringFieldUpdateOperationsInput | string
    welcomeMessage?: StringFieldUpdateOperationsInput | string
    showUpsellBanner?: BoolFieldUpdateOperationsInput | boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PhotoUpsertWithoutDeliveryPhotosInput = {
    update: XOR<PhotoUpdateWithoutDeliveryPhotosInput, PhotoUncheckedUpdateWithoutDeliveryPhotosInput>
    create: XOR<PhotoCreateWithoutDeliveryPhotosInput, PhotoUncheckedCreateWithoutDeliveryPhotosInput>
    where?: PhotoWhereInput
  }

  export type PhotoUpdateToOneWithWhereWithoutDeliveryPhotosInput = {
    where?: PhotoWhereInput
    data: XOR<PhotoUpdateWithoutDeliveryPhotosInput, PhotoUncheckedUpdateWithoutDeliveryPhotosInput>
  }

  export type PhotoUpdateWithoutDeliveryPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    hasPreview?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPhotosNestedInput
    folder?: PhotoFolderUpdateOneWithoutPhotosNestedInput
  }

  export type PhotoUncheckedUpdateWithoutDeliveryPhotosInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    hasPreview?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PhotoCreateManyUserInput = {
    id?: string
    url: string
    storagePath: string
    filename: string
    size: number
    width?: number | null
    height?: number | null
    mimeType?: string
    hasPreview?: boolean
    createdAt?: Date | string
    folderId?: string | null
  }

  export type PhotoFolderCreateManyUserInput = {
    id?: string
    name: string
    createdAt?: Date | string
  }

  export type PortfolioCreateManyUserInput = {
    id?: string
    title: string
    slug: string
    status?: string
    template?: string
    customDomain?: string | null
    content?: JsonNullValueInput | InputJsonValue
    views?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type LinksPageCreateManyUserInput = {
    id?: string
    template?: string
    displayName?: string
    bio?: string
    avatarUrl?: string
    avatarBg?: string
    avatarInitial?: string
    bgType?: string
    bgColor?: string
    bgGradFrom?: string
    bgGradTo?: string
    bgGradAngle?: number
    bgImageUrl?: string
    bgOverlayColor?: string
    bgOverlayOpacity?: number
    btnShape?: string
    btnVariant?: string
    btnBg?: string
    btnText?: string
    btnBorder?: string
    fontFamily?: string
    fontWeight?: string
    textColor?: string
    subColor?: string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    published?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DeliveryCreateManyUserInput = {
    id?: string
    title?: string
    client?: string
    status?: string
    template?: string
    layout?: string
    coverUrl?: string
    coverFit?: string
    coverPositionX?: number
    coverPositionY?: number
    passwordEnabled?: boolean
    password?: string
    whitelistEnabled?: boolean
    whitelist?: DeliveryCreatewhitelistInput | string[]
    passwordTitle?: string
    passwordSubtitle?: string
    passwordHint?: string
    passwordButtonLabel?: string
    mode?: string
    pricePerPhoto?: number
    priceFullGallery?: number
    downloadRes?: string
    logoMode?: string
    logoText?: string
    logoUrl?: string
    logoWidth?: number
    customColors?: boolean
    colorBg?: string
    colorFg?: string
    colorAccent?: string
    colorBtnBg?: string
    colorBtnFg?: string
    fontFamily?: string
    fontFamily1?: string
    fontFamily2?: string
    fontFamily3?: string
    welcomeMessage?: string
    showUpsellBanner?: boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: string | null
    views?: number
    expiresAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type MessageCreateManyUserInput = {
    id?: string
    authorName?: string
    body: string
    createdAt?: Date | string
  }

  export type PhotoUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    hasPreview?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    folder?: PhotoFolderUpdateOneWithoutPhotosNestedInput
    deliveryPhotos?: DeliveryPhotoUpdateManyWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    hasPreview?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
    deliveryPhotos?: DeliveryPhotoUncheckedUpdateManyWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    hasPreview?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    folderId?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type PhotoFolderUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUpdateManyWithoutFolderNestedInput
  }

  export type PhotoFolderUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: PhotoUncheckedUpdateManyWithoutFolderNestedInput
  }

  export type PhotoFolderUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PortfolioUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    content?: JsonNullValueInput | InputJsonValue
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PortfolioUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    content?: JsonNullValueInput | InputJsonValue
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type PortfolioUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    slug?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    customDomain?: NullableStringFieldUpdateOperationsInput | string | null
    content?: JsonNullValueInput | InputJsonValue
    views?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinksPageUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    avatarUrl?: StringFieldUpdateOperationsInput | string
    avatarBg?: StringFieldUpdateOperationsInput | string
    avatarInitial?: StringFieldUpdateOperationsInput | string
    bgType?: StringFieldUpdateOperationsInput | string
    bgColor?: StringFieldUpdateOperationsInput | string
    bgGradFrom?: StringFieldUpdateOperationsInput | string
    bgGradTo?: StringFieldUpdateOperationsInput | string
    bgGradAngle?: IntFieldUpdateOperationsInput | number
    bgImageUrl?: StringFieldUpdateOperationsInput | string
    bgOverlayColor?: StringFieldUpdateOperationsInput | string
    bgOverlayOpacity?: FloatFieldUpdateOperationsInput | number
    btnShape?: StringFieldUpdateOperationsInput | string
    btnVariant?: StringFieldUpdateOperationsInput | string
    btnBg?: StringFieldUpdateOperationsInput | string
    btnText?: StringFieldUpdateOperationsInput | string
    btnBorder?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontWeight?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    subColor?: StringFieldUpdateOperationsInput | string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    links?: LinkItemUpdateManyWithoutLinksPageNestedInput
  }

  export type LinksPageUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    avatarUrl?: StringFieldUpdateOperationsInput | string
    avatarBg?: StringFieldUpdateOperationsInput | string
    avatarInitial?: StringFieldUpdateOperationsInput | string
    bgType?: StringFieldUpdateOperationsInput | string
    bgColor?: StringFieldUpdateOperationsInput | string
    bgGradFrom?: StringFieldUpdateOperationsInput | string
    bgGradTo?: StringFieldUpdateOperationsInput | string
    bgGradAngle?: IntFieldUpdateOperationsInput | number
    bgImageUrl?: StringFieldUpdateOperationsInput | string
    bgOverlayColor?: StringFieldUpdateOperationsInput | string
    bgOverlayOpacity?: FloatFieldUpdateOperationsInput | number
    btnShape?: StringFieldUpdateOperationsInput | string
    btnVariant?: StringFieldUpdateOperationsInput | string
    btnBg?: StringFieldUpdateOperationsInput | string
    btnText?: StringFieldUpdateOperationsInput | string
    btnBorder?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontWeight?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    subColor?: StringFieldUpdateOperationsInput | string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    links?: LinkItemUncheckedUpdateManyWithoutLinksPageNestedInput
  }

  export type LinksPageUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    displayName?: StringFieldUpdateOperationsInput | string
    bio?: StringFieldUpdateOperationsInput | string
    avatarUrl?: StringFieldUpdateOperationsInput | string
    avatarBg?: StringFieldUpdateOperationsInput | string
    avatarInitial?: StringFieldUpdateOperationsInput | string
    bgType?: StringFieldUpdateOperationsInput | string
    bgColor?: StringFieldUpdateOperationsInput | string
    bgGradFrom?: StringFieldUpdateOperationsInput | string
    bgGradTo?: StringFieldUpdateOperationsInput | string
    bgGradAngle?: IntFieldUpdateOperationsInput | number
    bgImageUrl?: StringFieldUpdateOperationsInput | string
    bgOverlayColor?: StringFieldUpdateOperationsInput | string
    bgOverlayOpacity?: FloatFieldUpdateOperationsInput | number
    btnShape?: StringFieldUpdateOperationsInput | string
    btnVariant?: StringFieldUpdateOperationsInput | string
    btnBg?: StringFieldUpdateOperationsInput | string
    btnText?: StringFieldUpdateOperationsInput | string
    btnBorder?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontWeight?: StringFieldUpdateOperationsInput | string
    textColor?: StringFieldUpdateOperationsInput | string
    subColor?: StringFieldUpdateOperationsInput | string
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    published?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliveryUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    client?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    layout?: StringFieldUpdateOperationsInput | string
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverFit?: StringFieldUpdateOperationsInput | string
    coverPositionX?: FloatFieldUpdateOperationsInput | number
    coverPositionY?: FloatFieldUpdateOperationsInput | number
    passwordEnabled?: BoolFieldUpdateOperationsInput | boolean
    password?: StringFieldUpdateOperationsInput | string
    whitelistEnabled?: BoolFieldUpdateOperationsInput | boolean
    whitelist?: DeliveryUpdatewhitelistInput | string[]
    passwordTitle?: StringFieldUpdateOperationsInput | string
    passwordSubtitle?: StringFieldUpdateOperationsInput | string
    passwordHint?: StringFieldUpdateOperationsInput | string
    passwordButtonLabel?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pricePerPhoto?: FloatFieldUpdateOperationsInput | number
    priceFullGallery?: FloatFieldUpdateOperationsInput | number
    downloadRes?: StringFieldUpdateOperationsInput | string
    logoMode?: StringFieldUpdateOperationsInput | string
    logoText?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    logoWidth?: IntFieldUpdateOperationsInput | number
    customColors?: BoolFieldUpdateOperationsInput | boolean
    colorBg?: StringFieldUpdateOperationsInput | string
    colorFg?: StringFieldUpdateOperationsInput | string
    colorAccent?: StringFieldUpdateOperationsInput | string
    colorBtnBg?: StringFieldUpdateOperationsInput | string
    colorBtnFg?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontFamily1?: StringFieldUpdateOperationsInput | string
    fontFamily2?: StringFieldUpdateOperationsInput | string
    fontFamily3?: StringFieldUpdateOperationsInput | string
    welcomeMessage?: StringFieldUpdateOperationsInput | string
    showUpsellBanner?: BoolFieldUpdateOperationsInput | boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: DeliveryPhotoUpdateManyWithoutDeliveryNestedInput
  }

  export type DeliveryUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    client?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    layout?: StringFieldUpdateOperationsInput | string
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverFit?: StringFieldUpdateOperationsInput | string
    coverPositionX?: FloatFieldUpdateOperationsInput | number
    coverPositionY?: FloatFieldUpdateOperationsInput | number
    passwordEnabled?: BoolFieldUpdateOperationsInput | boolean
    password?: StringFieldUpdateOperationsInput | string
    whitelistEnabled?: BoolFieldUpdateOperationsInput | boolean
    whitelist?: DeliveryUpdatewhitelistInput | string[]
    passwordTitle?: StringFieldUpdateOperationsInput | string
    passwordSubtitle?: StringFieldUpdateOperationsInput | string
    passwordHint?: StringFieldUpdateOperationsInput | string
    passwordButtonLabel?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pricePerPhoto?: FloatFieldUpdateOperationsInput | number
    priceFullGallery?: FloatFieldUpdateOperationsInput | number
    downloadRes?: StringFieldUpdateOperationsInput | string
    logoMode?: StringFieldUpdateOperationsInput | string
    logoText?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    logoWidth?: IntFieldUpdateOperationsInput | number
    customColors?: BoolFieldUpdateOperationsInput | boolean
    colorBg?: StringFieldUpdateOperationsInput | string
    colorFg?: StringFieldUpdateOperationsInput | string
    colorAccent?: StringFieldUpdateOperationsInput | string
    colorBtnBg?: StringFieldUpdateOperationsInput | string
    colorBtnFg?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontFamily1?: StringFieldUpdateOperationsInput | string
    fontFamily2?: StringFieldUpdateOperationsInput | string
    fontFamily3?: StringFieldUpdateOperationsInput | string
    welcomeMessage?: StringFieldUpdateOperationsInput | string
    showUpsellBanner?: BoolFieldUpdateOperationsInput | boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    photos?: DeliveryPhotoUncheckedUpdateManyWithoutDeliveryNestedInput
  }

  export type DeliveryUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    client?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    template?: StringFieldUpdateOperationsInput | string
    layout?: StringFieldUpdateOperationsInput | string
    coverUrl?: StringFieldUpdateOperationsInput | string
    coverFit?: StringFieldUpdateOperationsInput | string
    coverPositionX?: FloatFieldUpdateOperationsInput | number
    coverPositionY?: FloatFieldUpdateOperationsInput | number
    passwordEnabled?: BoolFieldUpdateOperationsInput | boolean
    password?: StringFieldUpdateOperationsInput | string
    whitelistEnabled?: BoolFieldUpdateOperationsInput | boolean
    whitelist?: DeliveryUpdatewhitelistInput | string[]
    passwordTitle?: StringFieldUpdateOperationsInput | string
    passwordSubtitle?: StringFieldUpdateOperationsInput | string
    passwordHint?: StringFieldUpdateOperationsInput | string
    passwordButtonLabel?: StringFieldUpdateOperationsInput | string
    mode?: StringFieldUpdateOperationsInput | string
    pricePerPhoto?: FloatFieldUpdateOperationsInput | number
    priceFullGallery?: FloatFieldUpdateOperationsInput | number
    downloadRes?: StringFieldUpdateOperationsInput | string
    logoMode?: StringFieldUpdateOperationsInput | string
    logoText?: StringFieldUpdateOperationsInput | string
    logoUrl?: StringFieldUpdateOperationsInput | string
    logoWidth?: IntFieldUpdateOperationsInput | number
    customColors?: BoolFieldUpdateOperationsInput | boolean
    colorBg?: StringFieldUpdateOperationsInput | string
    colorFg?: StringFieldUpdateOperationsInput | string
    colorAccent?: StringFieldUpdateOperationsInput | string
    colorBtnBg?: StringFieldUpdateOperationsInput | string
    colorBtnFg?: StringFieldUpdateOperationsInput | string
    fontFamily?: StringFieldUpdateOperationsInput | string
    fontFamily1?: StringFieldUpdateOperationsInput | string
    fontFamily2?: StringFieldUpdateOperationsInput | string
    fontFamily3?: StringFieldUpdateOperationsInput | string
    welcomeMessage?: StringFieldUpdateOperationsInput | string
    showUpsellBanner?: BoolFieldUpdateOperationsInput | boolean
    labels?: JsonNullValueInput | InputJsonValue
    slug?: NullableStringFieldUpdateOperationsInput | string | null
    views?: IntFieldUpdateOperationsInput | number
    expiresAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type MessageUncheckedUpdateManyWithoutUserInput = {
    id?: StringFieldUpdateOperationsInput | string
    authorName?: StringFieldUpdateOperationsInput | string
    body?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliveryPhotoCreateManyPhotoInput = {
    id?: string
    deliveryId: string
    order?: number
  }

  export type DeliveryPhotoUpdateWithoutPhotoInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    delivery?: DeliveryUpdateOneRequiredWithoutPhotosNestedInput
  }

  export type DeliveryPhotoUncheckedUpdateWithoutPhotoInput = {
    id?: StringFieldUpdateOperationsInput | string
    deliveryId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type DeliveryPhotoUncheckedUpdateManyWithoutPhotoInput = {
    id?: StringFieldUpdateOperationsInput | string
    deliveryId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type PhotoCreateManyFolderInput = {
    id?: string
    userId: string
    url: string
    storagePath: string
    filename: string
    size: number
    width?: number | null
    height?: number | null
    mimeType?: string
    hasPreview?: boolean
    createdAt?: Date | string
  }

  export type PhotoUpdateWithoutFolderInput = {
    id?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    hasPreview?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutPhotosNestedInput
    deliveryPhotos?: DeliveryPhotoUpdateManyWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateWithoutFolderInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    hasPreview?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    deliveryPhotos?: DeliveryPhotoUncheckedUpdateManyWithoutPhotoNestedInput
  }

  export type PhotoUncheckedUpdateManyWithoutFolderInput = {
    id?: StringFieldUpdateOperationsInput | string
    userId?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    storagePath?: StringFieldUpdateOperationsInput | string
    filename?: StringFieldUpdateOperationsInput | string
    size?: IntFieldUpdateOperationsInput | number
    width?: NullableIntFieldUpdateOperationsInput | number | null
    height?: NullableIntFieldUpdateOperationsInput | number | null
    mimeType?: StringFieldUpdateOperationsInput | string
    hasPreview?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkItemCreateManyLinksPageInput = {
    id?: string
    type?: string
    title?: string
    url?: string
    enabled?: boolean
    order?: number
    icon?: string
    waCountry?: string | null
    waPhone?: string | null
    waMessage?: string | null
    igUsername?: string | null
    emailAddress?: string | null
    emailSubject?: string | null
    createdAt?: Date | string
  }

  export type LinkItemUpdateWithoutLinksPageInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    icon?: StringFieldUpdateOperationsInput | string
    waCountry?: NullableStringFieldUpdateOperationsInput | string | null
    waPhone?: NullableStringFieldUpdateOperationsInput | string | null
    waMessage?: NullableStringFieldUpdateOperationsInput | string | null
    igUsername?: NullableStringFieldUpdateOperationsInput | string | null
    emailAddress?: NullableStringFieldUpdateOperationsInput | string | null
    emailSubject?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkItemUncheckedUpdateWithoutLinksPageInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    icon?: StringFieldUpdateOperationsInput | string
    waCountry?: NullableStringFieldUpdateOperationsInput | string | null
    waPhone?: NullableStringFieldUpdateOperationsInput | string | null
    waMessage?: NullableStringFieldUpdateOperationsInput | string | null
    igUsername?: NullableStringFieldUpdateOperationsInput | string | null
    emailAddress?: NullableStringFieldUpdateOperationsInput | string | null
    emailSubject?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LinkItemUncheckedUpdateManyWithoutLinksPageInput = {
    id?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    url?: StringFieldUpdateOperationsInput | string
    enabled?: BoolFieldUpdateOperationsInput | boolean
    order?: IntFieldUpdateOperationsInput | number
    icon?: StringFieldUpdateOperationsInput | string
    waCountry?: NullableStringFieldUpdateOperationsInput | string | null
    waPhone?: NullableStringFieldUpdateOperationsInput | string | null
    waMessage?: NullableStringFieldUpdateOperationsInput | string | null
    igUsername?: NullableStringFieldUpdateOperationsInput | string | null
    emailAddress?: NullableStringFieldUpdateOperationsInput | string | null
    emailSubject?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DeliveryPhotoCreateManyDeliveryInput = {
    id?: string
    photoId: string
    order?: number
  }

  export type DeliveryPhotoUpdateWithoutDeliveryInput = {
    id?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
    photo?: PhotoUpdateOneRequiredWithoutDeliveryPhotosNestedInput
  }

  export type DeliveryPhotoUncheckedUpdateWithoutDeliveryInput = {
    id?: StringFieldUpdateOperationsInput | string
    photoId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }

  export type DeliveryPhotoUncheckedUpdateManyWithoutDeliveryInput = {
    id?: StringFieldUpdateOperationsInput | string
    photoId?: StringFieldUpdateOperationsInput | string
    order?: IntFieldUpdateOperationsInput | number
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}