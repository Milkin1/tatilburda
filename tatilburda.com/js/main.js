const burger = document.querySelector('.main__burger'),
    navigation = document.querySelector('.main-navigation')

burger.addEventListener('click', (e) => {
    if (e.target.classList.contains('active')) {
        e.currentTarget.classList.remove('active');
        navigation.classList.remove('active');
    } else {
        e.currentTarget.classList.add('active');
        navigation.classList.add('active');
    }

});