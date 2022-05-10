const encontrarCoincidencias = (arr, key, label1, label2) => {
    let arr2 = [];
      
    arr.forEach((x)=>{
         
      // Checking if there is any object in arr2
      // which contains the key value
       if(arr2.some((val)=>{ return val[key] === x[key] })){
           
         // If yes! then increase the occurrence by 1
         arr2.forEach((k)=>{
           if(k[key] === x[key]){ 
             k["Cantidad"]++
           }
        })
           
       }else{
         // If not! Then create a new object initialize 
         // it with the present iteration key's value and 
         // set the Cantidad to 1
         let a = {}
         a[key] = x[key]
         a[label1] = x[label1] + " " + x[label2]
         a["Cantidad"] = 1
         arr2.push(a);
       }
    })
      
    return arr2
}

export default encontrarCoincidencias;