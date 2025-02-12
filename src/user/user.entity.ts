import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { Role, Sex } from "./user.types";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: "date" })
  regDate: Date;

  @Column()
  role: Role;

  @Column("simple-array", { nullable: true })
  subscriptionsId?: string[];

  @Column("simple-array", { nullable: true })
  subscribersId?: string[];

  @Column({ type: "date", nullable: true })
  birthDate?: Date;

  @Column({ nullable: true })
  sex?: Sex;

  @Column({ nullable: true })
  avatar: string;

  @Column({ nullable: true })
  banner: string;
}
