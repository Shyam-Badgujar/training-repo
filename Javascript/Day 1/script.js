function showOutput() {

   
    var name = document.getElementById("username").value;

    
    alert("Hello " + name + " (This is alert output)");

   
    console.log("Hello " + name + " (This is console output)");

   
    document.getElementById("pageOutput").innerHTML =
        "Hello " + name + " (This is page output)";
}
