import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import Client from "./client";

@Entity({name: "access_tokens"})
export default class AccessToken {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    accessToken: string

    @Column()
    accessTokenExpiresAt: Date

    @OneToOne(() => Client, client => client.id)
    clientId: Client

    @Column()
    userId: string
    
    @Column()
    scope: string
}