const Product=require('../models/product')

const getAllProductsStatic=async(req,res)=>{
    const products=await Product.find({
        featured:true,
       
    })
    
    res.status(200).json({products, nbHits:products.length})
}

const getAllProducts=async(req,res)=>{
    const {featured,company,name,sort,fields,numericFilters}=req.query; //Jo schema mei hi nahi hai usse filter out karne ke liye

    const queryObject={}
    if(featured){   // Now if anything not in schema comes that will not create mess
        queryObject.featured=featured=== 'true'? true : false
        // And the things in schema will be returned ignoring the thing above
    }

    if(company){
        queryObject.company=company
    }
    //This thing for name is very very imp
    if(name){
        queryObject.name= {$regex: name, $options:'i'} // Agar pura naam na likhe aur bass kuch part likhe tab bhi search karke dega
    }
    if(numericFilters){
        const operatorMap={
            '>':'$gt',
            '>=':'$gte',
            '<':'$lt',
            '<=':'$lte',
            '=':'$eq',

        }
        const regEx=/\b(>|>=|<|<=|=)\b/g
        let filters=numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)

        const options=['price','rating']
        filters=filters.split(',').forEach((item) => {
            const [field,operator,value]=item.split('-')
            if(options.includes(fields)){
                queryObject[field]={[operator]:Number(value)}
            }
            
        });
    }
    

    let result=Product.find(queryObject) // Yes we can chain the sort here but there will be a condition when user will not pass sort

    // Thats the reason we are using if else for sorting here
    if(sort){
        const sortList=sort.split(',').join(' ')
        result=result.sort(sortList)
    }
    else{
        result=result.sort('createAt')
    }   

    if(fields){
        const fieldList=fields.split(',').join(' ')
        result=result.select(fieldList)
    }

    const page=Number(req.query.page) || 1
    const limit=Number(req.query.limit) || 10
    const skip=(page-1)*limit;


    result=result.skip(skip).limit(limit)
    const products=await result
    //const products=await Product.find(req.query) ->All included without seeing schema
    res.status(200).json({products, nbHits:products.length})
}

module.exports={
    getAllProducts,
    getAllProductsStatic,
}