import type {
    DeleteResult,
    EntityTarget,
    FindOneOptions,
    FindOptionsWhere,
    ObjectId,
    ObjectLiteral,
    Repository,
} from "typeorm";
import { AppDataSource } from "./datasource";

export default class Service<T extends ObjectLiteral> {
    // eslint-disable-next-line no-restricted-syntax
    private repository: Repository<T>;

    constructor(entity: EntityTarget<T>) {
        this.repository = AppDataSource.getRepository(entity);
    }

    protected async save(instance: T): Promise<T> {
        return this.repository.save(instance);
    }

    protected async find({ conditions }: { conditions?: T | undefined }): Promise<T[]> {
        return this.repository.find(conditions);
    }

    protected async findOne(options: FindOneOptions<T>): Promise<T | null> {
        return this.repository.findOne(options);
    }

    protected async findOneOrFail(conditions: FindOneOptions<T>): Promise<T> {
        return this.repository.findOneOrFail(conditions);
    }

    protected async update(
        criteria:
            | string
            | number
            | string[]
            | Date
            | ObjectId
            | number[]
            | Date[]
            | ObjectId[]
            | FindOptionsWhere<T>,
        partialInstance: Partial<T>
    ): Promise<ObjectLiteral> {
        return this.repository.update(criteria, partialInstance);
    }

    protected async delete(
        params:
            | string
            | number
            | string[]
            | Date
            | ObjectId
            | FindOptionsWhere<T>
            | number[]
            | Date[]
            | ObjectId[]
    ): Promise<DeleteResult> {
        return this.repository.delete(params);
    }
}
