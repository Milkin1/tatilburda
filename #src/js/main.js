//burger menu
const burger = document.querySelector('.main__burger'),
    navigation = document.querySelector('.main-navigation'),
    burgerBtn = document.querySelector('.burger-name'),
    logo = document.querySelector('.sm-logo');

burger.addEventListener('click', (e) => {
    if (e.target.classList.contains('active')) {
        e.currentTarget.classList.remove('active');
        navigation.classList.remove('active');
        burgerBtn.classList.remove('active');
        logo.classList.remove('active');
    } else {
        e.currentTarget.classList.add('active');
        navigation.classList.add('active');
        burgerBtn.classList.add('active');
        logo.classList.add('active');
    }
});


//tabs
const tabActivators = document.querySelectorAll(".tab_activator");
const tabChilds = document.querySelectorAll(".tab_child");

tabActivators.forEach((tabActivator) => {
    tabActivator.addEventListener('click', function (e) {
        tabActivators.forEach((tabActivator2) => {
            tabActivator2.classList.remove('active')
        })
        e.target.classList.add('active')
        tabChilds.forEach((tabChild) => {
            if (e.target.dataset.tab == tabChild.dataset.tab) {
                tabChild.classList.add('active')
            } else {
                tabChild.classList.remove('active')
            }
        })
    })
})