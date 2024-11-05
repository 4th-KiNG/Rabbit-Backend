import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Posts {
  @PrimaryGeneratedColumn("uuid")
  id: number;

  @Column()
  title: string;

  @Column()
  userId: string;

  @Column({ nullable: false})
  comId: number;

  @Column({ nullable: false})
  likeId: number;

  @Column()
  text: string;

  @Column()
  image: string;

  @Column()
  createDate: Date;
}