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
    }

);


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

//burger dropdown
const hotels = document.querySelector('.hotel__dropdown'),
    contact = document.querySelector('.hotel__contact');

hotels.addEventListener('click', (e) => {
    if (contact.classList.contains('active')) {
        contact.classList.remove('active');
    } else {
        contact.classList.add('active');
    }
});

//burger menu hide
const burgerNavigation = document.querySelector('.main-navigation'),
    navigationList = document.querySelector(".main-navigation__list");
let viewportWidth = window.innerWidth;
console.log(viewportWidth);


window.addEventListener('resize', () => {
    viewportWidth = window.innerWidth;
    viewChange();
});

viewChange();

function viewChange() {
    if (viewportWidth >= 1024) {
        burgerNavigation.classList.add('hide');
    } else {
        burgerNavigation.classList.remove('hide');
    }
}