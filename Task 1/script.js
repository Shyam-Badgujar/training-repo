function openTab(index){
    let tabs = document.querySelectorAll(".tab")
    let contents = document.querySelectorAll(".tab-content")

    tabs.forEach(element => {
        element.classList.remove("active")
    });

    contents.forEach(element => {
        element.classList.remove("active")
    });

    tabs[index].classList.add("active")
    contents[index].classList.add("active")
}

