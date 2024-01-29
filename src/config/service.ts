import {
    DeepPartial,
    EntityTarget,
    FindManyOptions,
    FindOneOptions,
    ObjectLiteral,
    Repository,
    getRepository,
} from "typeorm";
import { AppDataSource } from "./datasource";

export default class Service<T extends ObjectLiteral> {
    protected _repository: Repository<T>;

    constructor(entity: EntityTarget<T>) {
        if (!this._repository) {
            this._repository = AppDataSource.getRepository(entity);
        }
    }

    get repository() {
        return this._repository;
    }

    async save(instance: T) {
        return await this._repository.save(instance);
    }

    async find(conditions?: T | undefined) {
        return await this._repository.find(conditions);
    }

    async findOneOrFail(conditions: T) {
        return await this._repository.findOneOrFail(conditions);
    }

    async update(criteria: any, partialInstance: T) {
        return await this._repository.update(criteria, partialInstance);
    }

    async delete(params: any) {
        return await this._repository.delete(params);
    }
}
