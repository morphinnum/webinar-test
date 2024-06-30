const input = document.getElementById("phone");
const iti = window.intlTelInput(input, {
    initialCountry: "ua",
    onlyCountries: ["be", "bg", "hr", "cz", "dk",
    "ee", "fi", "fr", "de", "gr", "hu", "is", "ie", "it", "lv",
    "lt", "mk", "md", "no", "pl", "ro",
    "rs", "sk", "si", "es", "se", "ch", "ua", "gb"],
    utilsScript: "../js/utils.js",
});

function getSelectedCountryCode() {
    const countryData = iti.getSelectedCountryData();
    return countryData.dialCode;
}

document.getElementById('form-validate').addEventListener('submit', function(event) {
    event.preventDefault();

    document.getElementById('name-error').textContent = '';
    document.getElementById('phone-error').textContent = '';
    document.getElementById('email-error').textContent = '';
    
    const submitBtn = document.getElementById('submit-btn');

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    const dialCode = getSelectedCountryCode();
    const fullPhone = '+' + dialCode + phone;

    let valid = true;
    let firstErrorField = null;
    
    if (!name) {
        document.getElementById('name-error').textContent = 'Введите имя';
        if (!firstErrorField) firstErrorField = document.getElementById('name');
        valid = false;
    }

    if (!phone) {
        document.getElementById('phone-error').textContent = 'Введите номер телефона';
        if (!firstErrorField) firstErrorField = document.getElementById('phone');
        valid = false;
    }

    if (!email) {
        document.getElementById('email-error').textContent = 'Введите email';
        if (!firstErrorField) firstErrorField = document.getElementById('email');
        valid = false;
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (email && !emailPattern.test(email)) {
        document.getElementById('email-error').textContent = 'Введите валидный email адрес';
        valid = false;
    }

    const phonePattern = /^\d{9}$/;
    if (phone && !phonePattern.test(phone)) {
        document.getElementById('phone-error').textContent = 'Введите валидный номер телефона (9 цифр)';
        valid = false;
    }
    
    if (!valid) {
        if (firstErrorField) {
            firstErrorField.focus();
        }
        return;
    }

    const tg = {
        token: "TOKEN", 
        chat_id: "CHAT_ID",
    }
    
    const formData = {
        name: name,
        phone: fullPhone,
        email: email
    };

    async function sendMessage(msg) {
        const url = `https://api.telegram.org/bot${tg.token}/sendMessage`

        const obj = {
            chat_id: tg.chat_id,
            text: msg
        };

        await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(obj)
        }).then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            submitBtn.innerHTML = 'Запись успешная!'
            submitBtn.disabled = true;
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке формы, попробуйте еще раз');
        });
    }
    sendMessage(formData)
});
