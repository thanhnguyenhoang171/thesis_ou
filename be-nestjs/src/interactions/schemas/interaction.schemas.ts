import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

import { User } from 'src/users/schemas/user.schema';
import { Product } from 'src/products/schemas/products.schema';

export type InteractionDocument = HydratedDocument<Interaction>;

@Schema({ timestamps: true })
export class Interaction {

    // id user interaction
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
    user: mongoose.Schema.Types.ObjectId;
    /* Truy vấn userId qua populate await this.interactionModel.find().populate({
       path: 'user',
        select: 'userId name email',
    });
    */

    // ProductId interaction
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Product.name })
    product: mongoose.Schema.Types.ObjectId;

    //interaction such as clicks, views, purchased
    @Prop()
    clicks: Number; // Labeling rating is 1
    
    @Prop()
    views: Number; // Labeling rating is 3

    @Prop()
    Purchased: Number; // Labeling rating is 5


    @Prop({ type: Object })
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop({ type: Object })
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop({ type: Object })
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId;
        email: string;
    }

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const InteractionSchema = SchemaFactory.createForClass(Interaction);

