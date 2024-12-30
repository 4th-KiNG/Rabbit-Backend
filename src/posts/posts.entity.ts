import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posts {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column()
  ownerId: string;

  @Column("simple-array")
  commentsId: string[];

  @Column("simple-array")
  likesId: string[];

  @Column({ nullable: true })
  text: string;

  @Column()
  createDate: Date;

  @Column("simple-array")
  images: string[];
}
