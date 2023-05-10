
function openPop(a,b){

    document.getElementById('popup-'+b+a).style='display:flex'
   
 
}




function closePop(a,b){
    document.getElementById('popup-'+b+a).style='display:none'
    
}
    document.getElementById("close-alert").addEventListener("click", function() {
    document.getElementById("alert").style.display = "none";
   })



   function openPopReport(a){

    document.getElementById('popup-'+a).style='display:flex'
   
 
}



function closePopReport(a){
    document.getElementById('popup-'+a).style='display:none'
    
}
    document.getElementById("close-alert").addEventListener("click", function() {
    document.getElementById("alert").style.display = "none";
   })