import typegoose, {defaultClasses, getModelForClass} from '@typegoose/typegoose';
import {Offer} from '../../../types/offer.type.js';
import {City} from '../../../types/city.type.js';
import {Housing} from '../../../types/housing.type.js';
import {Convenience} from '../../../types/convenience.type.js';
import {UserEntity} from '../user/user.entity.js';
import {User} from '../../../types/user.type.js';
import {Coordinate} from '../../../types/coordinate.type.js';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends defaultClasses.Base {
}

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends defaultClasses.TimeStamps implements Offer {
  @prop({
    required: true,
    minlength: [10, 'Min length for name is 10'],
    maxlength: [100, 'Min length for name is 100']
  })
  public name!: string;

  @prop({
    required: true,
    minlength: [20, 'Min length for description is 20'],
    maxlength: [1024, 'Min length for description is 1024']
  })
  public description!: string;

  @prop({required: true})
  public date!: Date;

  @prop({
    required: true,
    type: () => String,
    enum: City
  })
  public city!: City;

  @prop({required: true})
  public previewImg!: string;

  @prop({
    required: true,
    type: () => String,
  })
  public images!: string[];

  @prop({required: true})
  public flagIsPremium!: boolean;

  @prop({required: true})
  public flagIsFavourites!: boolean;

  @prop({required: true})
  public rating!: 1 | 2 | 3 | 4 | 5;

  @prop({
    required: true,
    type: () => String,
    enum: Housing
  })
  public typeHousing!: Housing;

  @prop({required: true})
  public countRooms!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

  @prop({required: true})
  public countPeople!: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  @prop({
    required: true,
    min: [100, 'Min length for price is 100'],
    max: [100000, 'Min length for price is 100000'],
  })
  public price!: number;

  @prop({
    required: true,
    type: () => String,
    enum: Convenience
  })
  public conveniences!: Convenience;

  @prop({
    required: true,
    ref: UserEntity,
  })
  public author!: User;

  @prop({default: 0})
  public countComments!: number;

  @prop({
    required: true,
    type: () => String,
  })

  @prop({required: true})
  public coordinates!: Coordinate;

}

export const OfferModel = getModelForClass(OfferEntity);