const mongoose = require('mongoose')
const validator = require('validator')

const tourSchema = new mongoose.Schema({
    name : {
      type : String , 
      required : [true , 'A tour must have a name'] , 
      unique : true  , 
      trim : true ,
      maxLength : [40 , 'Thoda chota dal'] , 
      minLength : [10 , 'THoda bada dalo'] , 
      validate : {
        validator: val => validator.isAlpha(val, ["en-US"], { ignore: " -" }), //" =" => " " & "-"
        message: "A tour name must only contain characters between A-Z",
      }
    }  , 
    duration : {
      type : Number , 
      required : [true , 'A tour must have a duration']
    } , 
    maxGroupSize : {
      type : Number , 
      required : [true , 'A tour must have a group size']
    } , 
    difficulty : {
      type : String , 
      required : [true , 'A tour must have difficulty'] , 

    enum : {
      values :  ['easy' , 'medium' , 'difficult'] , 
      message : 'can be only easy medium difficult'
    } ,
  } ,
    ratingsAverage : {
      type : Number , 
      default : 4.5 , 
      min : [1 , 'Rating must be above 1'] , 
      max :  [5 , 'Must be less than or equal 5']
    } , 
    ratingsQuantity : {
      type : Number , 
      default : 0
    } , 
    priceDiscount : Number , 
    
    rating : {
      type : Number , 
      default : 4.5
    } , 
    price : {
      type : Number , 
      required : [true , 'A tour must have price']
    } , 
    priceDiscount : {
       type : Number , 
       validate : {
        validator : function(val){
          return val < this.price
        } , 
        message : 'Discount price should be below the regular price'
       }
    } ,
    summary : {
      type : String , 
      trim : true  , 
      required : [true , 'A tour must have a description']
    } , 
    description : {
      type : String , 
      trim : true 
    } , 
    imageCover : {
      type : String , 
      required : [true , 'A tour must have cover image']
    } , 
    images : [String] , 
    createdAt : {
      type : Date , 
      default : Date.now()
    } , 
    startDates : [Date]
} , {
  toJSON : { virtuals : true } , 
  toObject : { virtuals : true }
})
  

tourSchema.virtual('durationWeeks').get(function(){
  return this.duration / 7;
})

tourSchema.pre(/^find/ , function(next){
  this.start = Date.now()
  next()
})

tourSchema.post(/^find/ , function(docs ,next){
  console.log(`Query took ${Date.now() -this.start } ms`);
  next()
})
  
const Tour = mongoose.model('Tour' , tourSchema)
module.exports = Tour
