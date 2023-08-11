const Product=require('../models/product')

const getAllProductsStatic=async(req,res)=>{
    const products=await Product.find({
        featured:true,
       
    })
    
    res.status(200).json({products, nbHits:products.length})
}

const getAllProducts=async(req,res)=>{
    const {featured,company,name,sort}=req.query; //Jo schema mei hi nahi hai usse filter out karne ke liye

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
    

    let result=Product.find(queryObject)

    if(sort){
        const sortList=sort.split(',').join(' ')
        result=result.sort(sortList)
    }
    else{
        result=result.sort('createAt')
    }
    const products=await result
    //const products=await Product.find(req.query) ->All included without seeing schema
    res.status(200).json({products, nbHits:products.length})
}

module.exports={
    getAllProducts,
    getAllProductsStatic,
}