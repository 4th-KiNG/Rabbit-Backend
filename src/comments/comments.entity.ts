import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { ParentType } from "./comments.types";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  ownerId: string;

  @Column("simple-array")
  likesId: string[];

  @Column({ nullable: true })
  text?: string;

  @Column({ type: "date" })
  creationDate: Date;

  @Column({ nullable: true })
  parentId: string;

  @Column()
  parentType: ParentType;
}
