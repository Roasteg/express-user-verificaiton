import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "clients"})
export default class Client {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    clientId: string

    @Column()
    clientSecret: string

    @Column()
    callbackUrl: Date

    @Column({array: true})
    grants: string[]
}