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

  @Column({ nullable: true })
  avatarURL?: string;

  @Column()
  regDate: Date;

  @Column()
  role: Role;

  @Column("simple-array", { nullable: true })
  subscriptionsId?: string[];

  @Column("simple-array", { nullable: true })
  postsId?: string[];

  @Column("simple-array", { nullable: true })
  subscribersId?: string[];

  @Column({ nullable: true })
  birthDate?: Date;

  @Column({ nullable: true })
  sex?: Sex;

  @Column("simple-array", { nullable: true })
  commentsId?: string[];
}
