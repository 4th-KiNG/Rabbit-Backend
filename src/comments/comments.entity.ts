import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  ownerId: string;

  @Column("simple-array", { nullable: true })
  likesId?: string[];

  @Column("simple-array", { nullable: true })
  commentsId?: string[];

  @Column({ nullable: true })
  text?: string;

  @Column({ type: "date" })
  creationDate: Date;

  @Column({ nullable: true })
  parentId?: string;
}
