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

  @Column()
  avatarURL?: string;

  @Column()
  regDate: Date;

  @Column()
  role: Role;

  @Column()
  subscriptionsId?: string[];

  @Column()
  postsId?: string[];

  @Column()
  subscribersId?: string[];

  @Column()
  birthDate?: Date;

  @Column()
  sex?: Sex;

  @Column()
  commentsId?: string[];
}
