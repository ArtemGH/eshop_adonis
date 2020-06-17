"use strict";

function ShowRegisterWindow() {
  document.getElementById("loader").style.display = "block"
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("modal_container").innerHTML = this.responseText;
    }
    if (this.readyState == 4) {
      document.getElementById("loader").style.display = "none"
    }
  };
  xhttp.open("POST", "/users/get_registration_window", true);
  xhttp.send("get_registration_window");
  document.getElementById("modal_container").style.display = "block"
}

function HideRegisterWindow() {
  document.getElementById("modal_container").style.display = "none"
  document.getElementById("modal_container").innerHTML = ""
}

function CheckRegField(element_id) {
  if (element_id == 1) {
    document.getElementById("reg_login_img").src = "../decor/load_2.gif";
    let el_val = document.getElementById("reg_login").value;
    let login = JSON.stringify({post_type: 'NewLoginCheck', login: el_val});
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        if (el_val == document.getElementById("reg_login").value) {
              if (this.responseText == 'OK') {
            document.getElementById("reg_login_img").src = "../decor/ok.png"
          } else {
            document.getElementById("reg_login_img").src = "../decor/no.jpg"
          }
        }
      }
      if (this.readyState == 4 && this.status != 200) {
        if (el_val == document.getElementById("reg_login").value) {
          document.getElementById("reg_login_img").src = "../decor/no.jpg"
        }
      }
    }
    xhttp.open("POST", "/users/check_login_present", true);
    xhttp.send(login);
  }
  if (element_id == 2) {
    if (document.getElementById("reg_password").value != "") {
      document.getElementById("reg_password_img").src = "../decor/ok.png"
      if (document.getElementById("reg_confirm_password").value ==document.getElementById("reg_password").value) {
        document.getElementById("reg_confirm_password_img").src = "../decor/ok.png"
      } else {
        document.getElementById("reg_confirm_password_img").src = "../decor/no.jpg"
      }
    } else {document.getElementById("reg_password_img").src = "../decor/no.jpg"}
  }
  if (element_id == 3) {
    if (document.getElementById("reg_confirm_password").value == "") {document.getElementById("reg_confirm_password_img").src = "../img/no.png"}
    else {
      if (document.getElementById("reg_confirm_password").value == document.getElementById("reg_password").value) {
        document.getElementById("reg_confirm_password_img").src = "../decor/ok.png"
      } else {
        document.getElementById("reg_confirm_password_img").src = "../decor/no.jpg"
      }
    }
  }
  if (element_id == 4) {
    if (document.getElementById("reg_name").value == "") {document.getElementById("reg_name_img").src = "../img/no.png"}
    else {document.getElementById("reg_name_img").src = "../decor/ok.png"}
  }
  if (element_id == 5) {
    if (document.getElementById("reg_fam").value == "") {document.getElementById("reg_fam_img").src = "../img/no.png"}
    else {document.getElementById("reg_fam_img").src = "../decor/ok.png"}
  }
  if (element_id == 6) {
    if (document.getElementById("reg_tel").value == "") {document.getElementById("reg_tel_img").src = "../img/no.png"}
    else {document.getElementById("reg_tel_img").src = "../decor/ok.png"}
  }
  if (element_id == 7) {
    if (document.getElementById("reg_email").value == "") {document.getElementById("reg_email_img").src = "../img/no.png"}
    else {document.getElementById("reg_email_img").src = "../decor/ok.png"}
  }
}

function RegisterUser() {
  let post_type = 'new_user';
  let reg_login = document.getElementById('reg_login').value
  let reg_password = document.getElementById('reg_password').value
  let reg_name = document.getElementById('reg_name').value
  let reg_fam = document.getElementById('reg_fam').value
  let reg_tel = document.getElementById('reg_tel').value
  let reg_email = document.getElementById('reg_email').value

  if ((document.getElementById("reg_login_img").src.indexOf("/ok.png") != -1)&&
    (document.getElementById("reg_password_img").src.indexOf("/ok.png") != -1)&&
    (document.getElementById("reg_name_img").src.indexOf("/ok.png") != -1)&&
    (document.getElementById("reg_fam_img").src.indexOf("/ok.png") != -1)&&
    (document.getElementById("reg_tel_img").src.indexOf("/ok.png") != -1)&&
    (document.getElementById("reg_email_img").src.indexOf("/ok.png") != -1)) {
    document.getElementById("loader").style.display="block"
    let loginpass = JSON.stringify({
      post_type: post_type,
      reg_login: reg_login,
      reg_password: reg_password,
      reg_name: reg_name,
      reg_fam: reg_fam,
      reg_tel: reg_tel,
      reg_email: reg_email
    });
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4 && this.status == 200) {
        let answ=JSON.parse(this.responseText)
        let tempHTML =""

        if(answ.id > 0) {
          tempHTML+='<div class=flex_element_div> <a class=admin_href>'+answ.user_login+'</a></div>'
          tempHTML+='<div class=flex_element_div> <a class=admin_href href=javascript:logOut();>Выйти</a></div>'
          for(let i=0; i<answ.user_can_do.length; i++){
            if(answ.user_can_do[i] == 'prise') {
              tempHTML+='<div class=flex_element_div><a class=admin_href href=/content?page=1&cat_id=0&ContentType=Categories&filter=>Контент</a></div>'
            }
            if(answ.user_can_do[i]  == 'order') {
              tempHTML+= '<div class=flex_element_div><a class=admin_href href=/orders?page=1&filter=>Заказы</a></div>'
            }
            if(answ.user_can_do[i]  == 'user'){
              tempHTML+='<div class=flex_element_div><a class=admin_href href=/users?page=1&filter=>Пользователи</a></div>'
            }
          }
        } else{
          tempHTML+='<input class=login_input id=login_input name=login_input type=text placeholder=login>'
          tempHTML+='<b>   </b>'
          tempHTML+='<input class=\pass_input id=pass_input name=pass_input type=password placeholder=password>'
          tempHTML+='<b>   </b>'
          tempHTML+='<input class=login_button type=button value=Login onclick=Login()>'
          tempHTML+='<b>   </b>'
          tempHTML+='<a class=admin_href href=javascript:ShowRegisterWindow()>Регистрация</a>'
        }

        document.getElementById("privat_info_element_1").innerHTML = tempHTML;
        document.getElementById("modal_container").style.display = "none"
      }
      if (this.readyState == 4) {
        document.getElementById("loader").style.display = "none"
      }
    };
    xhttp.open("POST", "/users/register", true);
    xhttp.send(loginpass);
  }
}

function Login() {
  document.getElementById("loader").style.display = "block"
  let login = document.getElementById('login_input').value
  let password = document.getElementById('pass_input').value
  let loginpass = JSON.stringify({
    login: login,
    password: password,
  });
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let answer = JSON.parse(this.responseText)
      let tpmpHTML = ""
      if (answer.login == false ) {
        tpmpHTML+='<input class=login_input id=login_input name=login_input type=text placeholder=login>'
        tpmpHTML+='<b>   </b>'
        tpmpHTML+='<input class=\pass_input id=pass_input name=pass_input type=password placeholder=password>'
        tpmpHTML+='<b>   </b>'
        tpmpHTML+='<input class=login_button type=button value=Login onclick=Login()>'
        tpmpHTML+='<b>   </b>'
        tpmpHTML+='<a class=admin_href href=javascript:ShowRegisterWindow()>Регистрация</a>'
      } else {
        tpmpHTML+='<div class=flex_element_div> <a class=admin_href>'+answer.user_login+'</a></div>'
        tpmpHTML+='<div class=flex_element_div> <a class=admin_href href=javascript:logOut();>Выйти</a></div>'
        for(let i=0; i<answer.user_can_do.length; i++){
          if(answer.user_can_do[i] == 'prise') {
            tpmpHTML+='<div class=flex_element_div><a class=admin_href href=/content?page=1&cat_id=0&ContentType=Categories&filter=>Контент</a></div>'
          }
          if(answer.user_can_do[i]  == 'order') {
            tpmpHTML+='<div class=flex_element_div><a class=admin_href href=/orders?page=1&filter=>Заказы</a></div>'
          }
          if(answer.user_can_do[i]  == 'user'){
            tpmpHTML+='<div class=flex_element_div><a class=admin_href href=/users?page=1&filter=>Пользователи</a></div>'
          }
        }
      }
      document.getElementById("privat_info_element_1").innerHTML = tpmpHTML;
    }
    if (this.readyState == 4) {
      document.getElementById("loader").style.display = "none"
    }
  };
  xhttp.open("POST", "/users/login", true);
  xhttp.send(loginpass);
}

function logOut() {
  document.getElementById("loader").style.display = "block"
  let login = "LogOut"
  let loginpass = JSON.stringify({
    login: login,
  });
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      let temphtml = ""
      temphtml+='<input class=login_input id=login_input name=login_input type=text placeholder=login>'
      temphtml+='<b>   </b>'
      temphtml+='<input class=\pass_input id=pass_input name=pass_input type=password placeholder=password>'
      temphtml+='<b>   </b>'
      temphtml+='<input class=login_button type=button value=Login onclick=Login()>'
      temphtml+='<b>   </b>'
      temphtml+='<a class=admin_href href=javascript:ShowRegisterWindow()>Регистрация</a>'
      document.getElementById("privat_info_element_1").innerHTML = temphtml;
    }
    if (this.readyState == 4) {
      document.getElementById("loader").style.display = "none"
    }
  };
  xhttp.open("POST", "/users/logout", true);
  xhttp.send(loginpass);
}

function FindClick() {
  document.getElementById("loader").style.display="block"

  let find_url= document.documentURI;

  if (find_url.indexOf("categories?page=")!=-1) {
    location.href='/positions?page=1&cat=0&positions_record_count_on_page=10&filter='+document.getElementById("find_panel_input").value
  }
  else if (find_url.indexOf("positions?page=")!=-1) {
    location.href='/positions?page=1&cat=0&positions_record_count_on_page=10&filter='+document.getElementById("find_panel_input").value
  }
  else if (find_url.indexOf("content/?page=")!=-1) {
    location.href='/content/?page=1&cat_id=0&ContentType=Positions&filter='+document.getElementById("find_panel_input").value
  }
  else if (find_url.indexOf("users?page=")!=-1) {
    location.href='/users?page=1&filter='+document.getElementById("find_panel_input").value
  }
  else if (find_url.indexOf("orders?page=")!=-1) {
    location.href='/orders?page=1&filter='+document.getElementById("find_panel_input").value
  }
  else if (find_url.indexOf("shoping?filter=")!=-1) {
    location.href='/shoping?filter='+document.getElementById("find_panel_input").value
  }
  else
  {
    location.href='positions?page=1&cat=0&positions_record_count_on_page=10&filter='+document.getElementById("find_panel_input").value+''
  }
}
