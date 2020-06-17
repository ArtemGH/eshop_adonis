function GetPosText(pos_id) {
  let posid = JSON.stringify({pos_id: pos_id});
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      tinymce.activeEditor.setContent(this.responseText)
    }
  }
  xhttp.open("POST", "/content/get_edit_position_text", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(posid);
}

function ShowEditPosWindow(cat_id, pos_id, pos_name, pos_prise, username, filter, page_n) {

  document.getElementById("loader").style.display = "block"
  let posid = JSON.stringify({pos_id: pos_id, username:username});
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("modal_container").innerHTML = this.responseText;
      if (pos_id==0) {
        document.getElementById("edit_pos_form_header").innerText = "Добавить позицию"
        document.getElementById("edit_pos_name").value = ""
        document.getElementById("edit_pos_price").value = ""
        document.getElementById("edit_pos_img_file").setAttribute('oninput',"EditPosFileOnChange("+cat_id+", 0,'"+username+"')")
      }else{
        document.getElementById("edit_pos_form_header").innerText = "Редактировать позицию"
        document.getElementById("edit_pos_name").value = pos_name
        document.getElementById("edit_pos_price").value = pos_prise
        document.getElementById("edit_pos_img_file").setAttribute('oninput',"EditPosFileOnChange("+cat_id+", "+pos_id+",'"+username+"')")
      }
      document.getElementById("edit_pos_button").setAttribute('onclick',"EditPosSave("+cat_id+","+pos_id+",'"+username+"','"+filter+"',"+page_n+")")

      tinymce.init({
        selector: 'textarea',
        resize: true,
        theme_advanced_resizing : true,
        branding:false,
        plugins: ['link lists','media','fullscreen'],
        placeholder: 'Описание позиции',
        toolbar1: 'fullscreen | undo redo | formatselect fontselect fontsizeselect',
        toolbar2: 'alignleft aligncenter alignright alignjustify | numlist bullist | bold italic underline | link media | forecolor backcolor | removeformat',
        menubar: false,
        setup: function (editor) {
          editor.on('init',function (e) {
            GetPosText(pos_id)
          })
        }
      })
      document.getElementById("edit_pos_img").style = 'background-image: url(../temp/edit_pos_'+username+pos_id+'.jpg?'+new Date().getTime()+'); background-color: white'
    }
    if (this.readyState == 4) {
      document.getElementById("loader").style.display = "none"
    }
  };
  xhttp.open("POST", "/content/get_edit_position_window", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(posid);
  document.getElementById("modal_container").style.display = "block"
}

function HideEditPosWindow() {
  tinymce.remove()
  document.getElementById("modal_container").style.display = "none"
  document.getElementById("modal_container").innerHTML = ""
}

function EditPosFileOnChange(cat_id, pos_id, username) {
  if (document.getElementById("edit_pos_img_file").files.length > 0) {
    let reader = new FileReader()
    reader.readAsDataURL(document.getElementById("edit_pos_img_file").files[0])
    reader.onload = function () {
      let formData = new FormData();
      formData.append("pos_id", pos_id);
      formData.append("username", username);
      formData.append("new_image", reader.result)
      let tempstr = ""
      let xhttp = new XMLHttpRequest();
      xhttp.open('POST', '/content/set_foto_for_edit_pos');
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            tempstr = '<div style="background-image: url(../temp/edit_pos_'+username+pos_id+'.jpg?'+new Date().getTime()+'); background-color: white" class="edit_pos_img" id="edit_pos_img"></div>'
            if (pos_id == 0) {
              tempstr = tempstr + '<input type="file" class="edit_pos_img_file" id="edit_pos_img_file" accept="" oninput="EditPosFileOnChange('+cat_id+','+pos_id+',\''+username+'\')">'
            }else{
              tempstr = tempstr +'<input type="file" class="edit_pos_img_file" id="edit_pos_img_file" accept="" oninput="EditPosFileOnChange('+cat_id+','+pos_id+',\''+username+'\')">'
            }

            document.getElementById("edit_pos_img_cnt").innerHTML =tempstr

          } else {
            tempstr = '<div style="background-image: url(../temp/edit_pos_'+username+pos_id+'.jpg?'+new Date().getTime()+'); background-color: white" class="edit_pos_img" id="edit_pos_img"></div>'
            if (pos_id == 0) {
              tempstr = tempstr + '<input type="file" class="edit_pos_img_file" id="edit_pos_img_file" accept="" oninput="EditPosFileOnChange('+cat_id+','+pos_id+',\''+username+'\')">'
            }else{
              tempstr = tempstr +'<input type="file" class="edit_pos_img_file" id="edit_pos_img_file" accept="" oninput="EditPosFileOnChange('+cat_id+','+pos_id+',\''+username+'\')">'
            }

            document.getElementById("edit_pos_img_cnt").innerHTML =tempstr
          }
        }
      }
      xhttp.send(formData);
    }
  }
}

function EditPosSave(cat_id,pos_id, username, filter, page_n) {
  document.getElementById("modal_container").style.display="none"
  document.getElementById("loader").style.display="block"

  let formData = new FormData();
  formData.append("page_n", page_n);
  formData.append("filter", filter);
  formData.append("username", username);
  formData.append("cat_id", cat_id);
  formData.append("pos_id", pos_id);
  formData.append("pos_name", document.getElementById("edit_pos_name").value);
  formData.append("pos_price", document.getElementById("edit_pos_price").value);
  formData.append("text", tinymce.activeEditor.getContent());

  let xhttp = new XMLHttpRequest();
  xhttp.open('POST', '/content/save_position');
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
//        alert(xhttp.responseText)
        let data = JSON.parse(xhttp.responseText)
        let htmlstr = ""
        htmlstr= htmlstr+'<div class="pages">Страница:'
        if(page_n > 1){
          htmlstr=htmlstr+'<a class=page href=/content?page=1&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Первая> << </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)-1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Предыдущая> < </a>'
        }
        for(let i=0; i<data.pages_nav.length; i++){
          if(data.page_n==i){
            htmlstr=htmlstr+'<a class=page_activ href=/content?page='+(Number(i)+1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }else{
            htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(i)+1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }
        }
        if(page_n < data.page_count){
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)+1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Следующая> > </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+data.page_count+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Последняя> >> </a>'
        }
        htmlstr=htmlstr+'</div>'

        htmlstr=htmlstr+'<div style="border: none" class="content_grid_sub_tab" id="content_grid_sub" >'
        htmlstr=htmlstr+'<div class="content_grid_item_1_content_pos">'
        htmlstr=htmlstr+'<input class="AddContentButton" type="button" value="Добавить" onclick="ShowEditPosWindow('+cat_id+',0,\'\',0,\''+username+'\',\''+filter+'\','+page_n+')">'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'</div>'

        htmlstr=htmlstr+'<div class="content_grid_sub_tab" id="content_grid_sub" >'
        htmlstr=htmlstr+'<div class="content_grid_item_1_content_pos">'
        htmlstr=htmlstr+'<h3>Фото</h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'<div class="content_grid_item_2_content_pos" >'
        htmlstr=htmlstr+'<h3>Название</h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'<div class="content_grid_item_3_content_pos" >'
        htmlstr=htmlstr+'<h3>Цена</h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'<div class="content_grid_item_4_content_pos" >'
        htmlstr=htmlstr+'<h3></h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'</div>'

        for(let i=0; i<data.data.length; i++){
          htmlstr=htmlstr+'<div class="content_grid_sub_tab" id="content_grid_sub" >'

          htmlstr=htmlstr+'<div class="content_grid_item_1_content_pos">'
          htmlstr=htmlstr+'<a class="content_grid_item_1_content_link" href="javascript:ShowEditPosWindow('+cat_id+','+data.data[i].id+',\''+data.data[i].pos_name+'\','+data.data[i].pos_prise+',\''+username+'\',\''+filter+'\','+page_n+')" align="center">'
          htmlstr=htmlstr+'<img class="content_grid_item_img" src="../content/img/pos/pos_'+data.data[i].id+'.jpg?'+data.time_marker+'"> </a>'
          htmlstr=htmlstr+'<p>'
          htmlstr=htmlstr+'</div>'

          htmlstr=htmlstr+'<div class="content_grid_item_2_content_pos" >'
          htmlstr=htmlstr+'<a class="content_grid_item_1_content_link" href="javascript:ShowEditPosWindow('+cat_id+','+data.data[i].id+',\''+data.data[i].pos_name+'\','+data.data[i].pos_prise+',\''+username+'\',\''+filter+'\','+page_n+')"> '+data.data[i].pos_name+' </a>'
          htmlstr=htmlstr+'</div>'

          htmlstr=htmlstr+'<div class="content_grid_item_3_content_pos" >'
          htmlstr=htmlstr+'<a class="content_grid_item_1_content_link" href="javascript:ShowEditPosWindow('+cat_id+','+data.data[i].id+',\''+data.data[i].pos_name+'\','+data.data[i].pos_prise+',\''+username+'\',\''+filter+'\','+page_n+')">'+data.data[i].pos_prise+'</a>'
          htmlstr=htmlstr+'</div>'

          htmlstr=htmlstr+'<div class="content_grid_item_4_content_pos" >'
          htmlstr=htmlstr+'<input class="EditContentButton" type="button" value="Редактировать" onclick="ShowEditPosWindow('+cat_id+','+data.data[i].id+',\''+data.data[i].pos_name+'\','+data.data[i].pos_prise+',\''+username+'\',\''+filter+'\','+page_n+')">'
          htmlstr=htmlstr+'<input class="DeleteContentButton" type="button" value="Удалить" onclick="DelPosClick('+data.data[i].id+','+cat_id+','+page_n+',\''+filter+'\',\''+username+'\')">'
          htmlstr=htmlstr+'</div>'
          htmlstr=htmlstr+'</div>'
        }


        htmlstr= htmlstr+'<div class="pages">Страница:'
        if(page_n > 1){
          htmlstr=htmlstr+'<a class=page href=/content?page=1&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Первая> << </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)-1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Предыдущая> < </a>'
        }
        for(let i=0; i<data.pages_nav.length; i++){
          if(data.page_n==i){
            htmlstr=htmlstr+'<a class=page_activ href=/content?page='+(Number(i)+1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }else{
            htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(i)+1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }
        }
        if(page_n < data.page_count){
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)+1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Следующая> > </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+data.page_count+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Последняя> >> </a>'
        }
        htmlstr=htmlstr+'</div>'
        document.getElementById("content_grid").innerHTML = htmlstr

      } else {

      }
      document.getElementById("loader").style.display = "none"
    }
  }
  xhttp.send(formData);
  HideEditPosWindow()
}

function DelPosClick(pos_id, cat_id, page_n, filter, username) {
  document.getElementById("modal_container").style.display="none"
  document.getElementById("loader").style.display="block"

  let formData = new FormData();
  formData.append("page_n", page_n);
  formData.append("filter", filter);
  formData.append("cat_id", cat_id);
  formData.append("pos_id", pos_id);

  let xhttp = new XMLHttpRequest();
  xhttp.open('POST', '/content/delete_position');
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
//        alert(xhttp.responseText)
        let data = JSON.parse(xhttp.responseText)
        let htmlstr = ""
        htmlstr= htmlstr+'<div class="pages">Страница:'
        if(page_n > 1){
          htmlstr=htmlstr+'<a class=page href=/content?page=1&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Первая> << </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)-1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Предыдущая> < </a>'
        }
        for(let i=0; i<data.pages_nav.length; i++){
          if(data.page_n==i){
            htmlstr=htmlstr+'<a class=page_activ href=/content?page='+(Number(i)+1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }else{
            htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(i)+1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }
        }
        if(page_n < data.page_count){
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)+1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Следующая> > </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+data.page_count+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Последняя> >> </a>'
        }
        htmlstr=htmlstr+'</div>'

        htmlstr=htmlstr+'<div style="border: none" class="content_grid_sub_tab" id="content_grid_sub" >'
        htmlstr=htmlstr+'<div class="content_grid_item_1_content_pos">'
        htmlstr=htmlstr+'<input class="AddContentButton" type="button" value="Добавить" onclick="ShowEditPosWindow('+cat_id+',0,\'\',0,\''+username+'\',\''+filter+'\','+page_n+')">'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'</div>'

        htmlstr=htmlstr+'<div class="content_grid_sub_tab" id="content_grid_sub" >'
        htmlstr=htmlstr+'<div class="content_grid_item_1_content_pos">'
        htmlstr=htmlstr+'<h3>Фото</h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'<div class="content_grid_item_2_content_pos" >'
        htmlstr=htmlstr+'<h3>Название</h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'<div class="content_grid_item_3_content_pos" >'
        htmlstr=htmlstr+'<h3>Цена</h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'<div class="content_grid_item_4_content_pos" >'
        htmlstr=htmlstr+'<h3></h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'</div>'

        for(let i=0; i<data.data.length; i++){
          htmlstr=htmlstr+'<div class="content_grid_sub_tab" id="content_grid_sub" >'

          htmlstr=htmlstr+'<div class="content_grid_item_1_content_pos">'
          htmlstr=htmlstr+'<a class="content_grid_item_1_content_link" href="javascript:ShowEditPosWindow('+cat_id+','+data.data[i].id+',\''+data.data[i].pos_name+'\','+data.data[i].pos_prise+',\''+username+'\',\''+filter+'\','+page_n+')" align="center">'
          htmlstr=htmlstr+'<img class="content_grid_item_img" src="../content/img/pos/pos_'+data.data[i].id+'.jpg?'+data.time_marker+'"> </a>'
          htmlstr=htmlstr+'<p>'
          htmlstr=htmlstr+'</div>'

          htmlstr=htmlstr+'<div class="content_grid_item_2_content_pos" >'
          htmlstr=htmlstr+'<a class="content_grid_item_1_content_link" href="javascript:ShowEditPosWindow('+cat_id+','+data.data[i].id+',\''+data.data[i].pos_name+'\','+data.data[i].pos_prise+',\''+username+'\',\''+filter+'\','+page_n+')"> '+data.data[i].pos_name+' </a>'
          htmlstr=htmlstr+'</div>'

          htmlstr=htmlstr+'<div class="content_grid_item_3_content_pos" >'
          htmlstr=htmlstr+'<a class="content_grid_item_1_content_link" href="javascript:ShowEditPosWindow('+cat_id+','+data.data[i].id+',\''+data.data[i].pos_name+'\','+data.data[i].pos_prise+',\''+username+'\',\''+filter+'\','+page_n+')">'+data.data[i].pos_prise+'</a>'
          htmlstr=htmlstr+'</div>'

          htmlstr=htmlstr+'<div class="content_grid_item_4_content_pos" >'
          htmlstr=htmlstr+'<input class="EditContentButton" type="button" value="Редактировать" onclick="ShowEditPosWindow('+cat_id+','+data.data[i].id+',\''+data.data[i].pos_name+'\','+data.data[i].pos_prise+',\''+username+'\',\''+filter+'\','+page_n+')">'
          htmlstr=htmlstr+'<input class="DeleteContentButton" type="button" value="Удалить" onclick="DelPosClick('+data.data[i].id+','+cat_id+','+page_n+',\''+filter+'\',\''+username+'\')">'
          htmlstr=htmlstr+'</div>'
          htmlstr=htmlstr+'</div>'
        }


        htmlstr= htmlstr+'<div class="pages">Страница:'
        if(page_n > 1){
          htmlstr=htmlstr+'<a class=page href=/content?page=1&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Первая> << </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)-1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Предыдущая> < </a>'
        }
        for(let i=0; i<data.pages_nav.length; i++){
          if(data.page_n==i){
            htmlstr=htmlstr+'<a class=page_activ href=/content?page='+(Number(i)+1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }else{
            htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(i)+1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }
        }
        if(page_n < data.page_count){
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)+1)+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Следующая> > </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+data.page_count+'&cat_id='+cat_id+'&ContentType=Positions&filter='+filter+' title=Последняя> >> </a>'
        }
        htmlstr=htmlstr+'</div>'
        document.getElementById("content_grid").innerHTML = htmlstr

      } else {

      }
      document.getElementById("loader").style.display = "none"
    }
  }
  xhttp.send(formData);
  HideEditPosWindow()
}

function ShowEditCatWindow(cat_id, cat_name, username, filter, page_n) {

  document.getElementById("loader").style.display = "block"
  let catid = JSON.stringify({cat_id: cat_id, username:username});
  let xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("modal_container").innerHTML = this.responseText;
      if (cat_id==0) {
        document.getElementById("edit_cat_form_header").innerText = "Добавить категорию"
        document.getElementById("edit_cat_name").value = ""
        document.getElementById("edit_cat_img_file").setAttribute('oninput',"EditCatFileOnChange("+cat_id+",'"+username+"')")
      }else{
        document.getElementById("edit_cat_form_header").innerText = "Редактировать категорию"
        document.getElementById("edit_cat_name").value = cat_name
        document.getElementById("edit_cat_img_file").setAttribute('oninput',"EditCatFileOnChange("+cat_id+",'"+username+"')")
      }
      document.getElementById("edit_cat_button").setAttribute('onclick',"EditCatSave("+cat_id+",'"+username+"','"+filter+"',"+page_n+")")
      document.getElementById("edit_cat_img").style = 'background-image: url(../temp/edit_cat_'+username+cat_id+'.jpg?'+new Date().getTime()+'); background-color: white'
    }
    if (this.readyState == 4) {
      document.getElementById("loader").style.display = "none"
    }
  };
  xhttp.open("POST", "/content/get_edit_cat_window", true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(catid);
  document.getElementById("modal_container").style.display = "block"
}

function HideEditCatWindow() {
  document.getElementById("modal_container").style.display = "none"
  document.getElementById("modal_container").innerHTML = ""
}

function EditCatFileOnChange(cat_id, username) {
  if (document.getElementById("edit_cat_img_file").files.length > 0) {
    let reader = new FileReader()
    reader.readAsDataURL(document.getElementById("edit_cat_img_file").files[0])
    reader.onload = function () {
      let formData = new FormData();
      formData.append("cat_id", cat_id);
      formData.append("username", username);
      formData.append("new_image", reader.result)
      let tempstr = ""
      let xhttp = new XMLHttpRequest();
      xhttp.open('POST', '/content/set_foto_for_edit_cat');
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            tempstr = '<div style="background-image: url(../temp/edit_cat_'+username+cat_id+'.jpg?'+new Date().getTime()+'); background-color: white" class="edit_cat_img" id="edit_cat_img"></div>'
            if (cat_id == 0) {
              tempstr = tempstr + '<input type="file" class="edit_cat_img_file" id="edit_cat_img_file" accept="" oninput="EditCatFileOnChange('+cat_id+',\''+username+'\')">'
            }else{
              tempstr = tempstr +'<input type="file" class="edit_cat_img_file" id="edit_cat_img_file" accept="" oninput="EditCatFileOnChange('+cat_id+',\''+username+'\')">'
            }
            document.getElementById("edit_cat_img_cnt").innerHTML =tempstr
          } else {
            tempstr = '<div style="background-image: url(../temp/edit_cat_'+username+cat_id+'.jpg?'+new Date().getTime()+'); background-color: white" class="edit_cat_img" id="edit_cat_img"></div>'
            if (cat_id == 0) {
              tempstr = tempstr + '<input type="file" class="edit_cat_img_file" id="edit_cat_img_file" accept="" oninput="EditCatFileOnChange('+cat_id+',\''+username+'\')">'
            }else{
              tempstr = tempstr +'<input type="file" class="edit_cat_img_file" id="edit_cat_img_file" accept="" oninput="EditPosFileOnChange('+cat_id+',\''+username+'\')">'
            }
            document.getElementById("edit_cat_img_cnt").innerHTML =tempstr
          }
        }
      }
      xhttp.send(formData);
    }
  }
}

function EditCatSave(cat_id, username, filter, page_n) {
  document.getElementById("modal_container").style.display="none"
  document.getElementById("loader").style.display="block"

  let formData = new FormData();
  formData.append("page_n", page_n);
  formData.append("filter", filter);
  formData.append("username", username);
  formData.append("cat_id", cat_id);
  formData.append("cat_name", document.getElementById("edit_cat_name").value);

  let xhttp = new XMLHttpRequest();
  xhttp.open('POST', '/content/save_cat');
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
//        alert(xhttp.responseText)
        let data = JSON.parse(xhttp.responseText)
        let htmlstr = ""
        htmlstr= htmlstr+'<div class="pages">Страница:'
        if(page_n > 1){
          htmlstr=htmlstr+'<a class=page href=/content?page=1&cat_id=0&ContentType=Categories&filter='+filter+' title=Первая> << </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)-1)+'&cat_id=0&ContentType=Categories&filter='+filter+' title=Предыдущая> < </a>'
        }
        for(let i=0; i<data.pages_nav.length; i++){
          if(data.page_n==i){
            htmlstr=htmlstr+'<a class=page_activ href=/content?page='+(Number(i)+1)+'&cat_id=0&ContentType=Categories&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }else{
            htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(i)+1)+'&cat_id=Categories&ContentType=Categories&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }
        }
        if(page_n < data.page_count){
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)+1)+'&cat_id=0&ContentType=Categories&filter='+filter+' title=Следующая> > </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+data.page_count+'&cat_id=0&ContentType=Categories&filter='+filter+' title=Последняя> >> </a>'
        }
        htmlstr=htmlstr+'</div>'

        htmlstr=htmlstr+'<div style="border: none" class="content_grid_sub_tab" id="content_grid_sub" >'
        htmlstr=htmlstr+'<div class="content_grid_item_1_content_cats">'
        htmlstr=htmlstr+'<input class="AddContentButton" type="button" value="Добавить" onclick="ShowEditCatWindow('+0+',\''+0+'\',\''+username+'\',\''+filter+'\','+page_n+')">'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'</div>'

        htmlstr=htmlstr+'<div class="content_grid_sub_tab" id="content_grid_sub" >'
        htmlstr=htmlstr+'<div class="content_grid_item_1_content_cats">'
        htmlstr=htmlstr+'<h3>Фото</h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'<div class="content_grid_item_2_content_cats" >'
        htmlstr=htmlstr+'<h3>Название</h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'<div class="content_grid_item_3_content_cats" >'
        htmlstr=htmlstr+'<h3>Позиции</h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'<div class="content_grid_item_4_content_cats" >'
        htmlstr=htmlstr+'<h3></h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'</div>'

        for(let i=0; i<data.data.length;i++){
          htmlstr=htmlstr+'<div class="content_grid_sub_tab" id="content_grid_sub" >'
          htmlstr=htmlstr+'<div class="content_grid_item_1_content_cats">'
          htmlstr=htmlstr+'<a class="content_grid_item_1_content_link" href="/content?page=1&cat_id='+data.data[i].id+'&ContentType=Positions&filter=" align="center">'
          htmlstr=htmlstr+'<img class=\"content_grid_item_img\" src="../content/img/cat/cat_'+data.data[i].id+'.jpg?'+data.time_marker+'"> </a>'
          htmlstr=htmlstr+'</div>'

          htmlstr=htmlstr+'<div class="content_grid_item_2_content_cats" >'
          htmlstr=htmlstr+'<a class="content_grid_item_1_content_link" href="/content?page=1&cat_id='+data.data[i].id+'&ContentType=Positions&filter="> '+data.data[i].cat_name+' </a>'
          htmlstr=htmlstr+'</div>'

          htmlstr=htmlstr+'<div class="content_grid_item_3_content_cats" >'
          htmlstr=htmlstr+'<a class="content_grid_item_1_content_link" href="/content?page=1&cat_id='+data.data[i].id+'&ContentType=Positions&filter="> '+data.data[i].pos_count+' </a>'
          htmlstr=htmlstr+'</div>'

          htmlstr=htmlstr+'<div class=\"content_grid_item_4_content_cats\" >'
          htmlstr=htmlstr+'<input class="EditContentButton" type="button" value="Редактировать" onclick="ShowEditCatWindow('+data.data[i].id+',\''+data.data[i].cat_name+'\',\''+username+'\',\''+filter+'\','+page_n+')">'
          if(data.data[i].pos_count==0){
            htmlstr=htmlstr+'<input class="DeleteContentButton" type="button" value="Удалить" onclick="DelCatClick('+data.data[i].id+','+page_n+',\''+filter+'\',\''+username+'\')">'
          }
          htmlstr=htmlstr+'</div>'
          htmlstr=htmlstr+'</div>'
        }
        htmlstr= htmlstr+'<div class="pages">Страница:'
        if(page_n > 1){
          htmlstr=htmlstr+'<a class=page href=/content?page=1&cat_id=0&ContentType=Categories&filter='+filter+' title=Первая> << </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)-1)+'&cat_id=0&ContentType=Categories&filter='+filter+' title=Предыдущая> < </a>'
        }
        for(let i=0; i<data.pages_nav.length; i++){
          if(data.page_n==i){
            htmlstr=htmlstr+'<a class=page_activ href=/content?page='+(Number(i)+1)+'&cat_id=0&ContentType=Categories&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }else{
            htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(i)+1)+'&cat_id=Categories&ContentType=Categories&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }
        }
        if(page_n < data.page_count){
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)+1)+'&cat_id=0&ContentType=Categories&filter='+filter+' title=Следующая> > </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+data.page_count+'&cat_id=0&ContentType=Categories&filter='+filter+' title=Последняя> >> </a>'
        }
        htmlstr=htmlstr+'</div>'
        document.getElementById("content_grid").innerHTML = htmlstr

      } else {

      }
      document.getElementById("loader").style.display = "none"
    }
  }
  xhttp.send(formData);
  HideEditCatWindow()
}

function DelCatClick(cat_id, page_n, filter, username) {
  document.getElementById("modal_container").style.display="none"
  document.getElementById("loader").style.display="block"

  let formData = new FormData();
  formData.append("page_n", page_n);
  formData.append("filter", filter);
  formData.append("cat_id", cat_id);

  let xhttp = new XMLHttpRequest();
  xhttp.open('POST', '/content/delete_cat');
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      if (this.status == 200) {
//        alert(xhttp.responseText)
        let data = JSON.parse(xhttp.responseText)
        let htmlstr = ""
        htmlstr= htmlstr+'<div class="pages">Страница:'
        if(page_n > 1){
          htmlstr=htmlstr+'<a class=page href=/content?page=1&cat_id=0&ContentType=Categories&filter='+filter+' title=Первая> << </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)-1)+'&cat_id=0&ContentType=Categories&filter='+filter+' title=Предыдущая> < </a>'
        }
        for(let i=0; i<data.pages_nav.length; i++){
          if(data.page_n==i){
            htmlstr=htmlstr+'<a class=page_activ href=/content?page='+(Number(i)+1)+'&cat_id=0&ContentType=Categories&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }else{
            htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(i)+1)+'&cat_id=Categories&ContentType=Categories&filter='+filter+' title='+(Number(i)+1)+'> '+(Number(i)+1)+' </a>'
          }
        }
        if(page_n < data.page_count){
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)+1)+'&cat_id=0&ContentType=Categories&filter='+filter+' title=Следующая> > </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+data.page_count+'&cat_id=0&ContentType=Categories&filter='+filter+' title=Последняя> >> </a>'
        }
        htmlstr=htmlstr+'</div>'

        htmlstr=htmlstr+'<div style="border: none" class="content_grid_sub_tab" id="content_grid_sub" >'
        htmlstr=htmlstr+'<div class="content_grid_item_1_content_cats">'
        htmlstr=htmlstr+'<input class="AddContentButton" type="button" value="Добавить" onclick="ShowEditCatWindow('+0+',\''+0+'\',\''+username+'\',\''+filter+'\','+page_n+')">'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'</div>'

        htmlstr=htmlstr+'<div class="content_grid_sub_tab" id="content_grid_sub" >'
        htmlstr=htmlstr+'<div class="content_grid_item_1_content_cats">'
        htmlstr=htmlstr+'<h3>Фото</h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'<div class="content_grid_item_2_content_cats" >'
        htmlstr=htmlstr+'<h3>Название</h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'<div class="content_grid_item_3_content_cats" >'
        htmlstr=htmlstr+'<h3>Позиции</h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'<div class="content_grid_item_4_content_cats" >'
        htmlstr=htmlstr+'<h3></h3>'
        htmlstr=htmlstr+'</div>'
        htmlstr=htmlstr+'</div>'

        for(let i=0; i<data.data.length;i++){
          htmlstr=htmlstr+'<div class="content_grid_sub_tab" id="content_grid_sub" >'
          htmlstr=htmlstr+'<div class="content_grid_item_1_content_cats">'
          htmlstr=htmlstr+'<a class="content_grid_item_1_content_link" href="/content?page=1&cat_id='+data.data[i].id+'&ContentType=Positions&filter=" align="center">'
          htmlstr=htmlstr+'<img class=\"content_grid_item_img\" src="../content/img/cat/cat_'+data.data[i].id+'.jpg?'+data.time_marker+'"> </a>'
          htmlstr=htmlstr+'</div>'

          htmlstr=htmlstr+'<div class="content_grid_item_2_content_cats" >'
          htmlstr=htmlstr+'<a class="content_grid_item_1_content_link" href="/content?page=1&cat_id='+data.data[i].id+'&ContentType=Positions&filter="> '+data.data[i].cat_name+' </a>'
          htmlstr=htmlstr+'</div>'

          htmlstr=htmlstr+'<div class="content_grid_item_3_content_cats" >'
          htmlstr=htmlstr+'<a class="content_grid_item_1_content_link" href="/content?page=1&cat_id='+data.data[i].id+'&ContentType=Positions&filter="> '+data.data[i].pos_count+' </a>'
          htmlstr=htmlstr+'</div>'

          htmlstr=htmlstr+'<div class=\"content_grid_item_4_content_cats\" >'
          htmlstr=htmlstr+'<input class="EditContentButton" type="button" value="Редактировать" onclick="ShowEditCatWindow('+data.data[i].id+',\''+data.data[i].cat_name+'\',\''+username+'\',\''+filter+'\','+page_n+')">'
          if(data.data[i].pos_count==0){
            htmlstr=htmlstr+'<input class="DeleteContentButton" type="button" value="Удалить" onclick="DelCatClick('+data.data[i].id+','+page_n+',\''+filter+'\',\''+username+'\')">'
          }
          htmlstr=htmlstr+'</div>'
          htmlstr=htmlstr+'</div>'
        }
        htmlstr= htmlstr+'<div class="pages">Страница:'
        if(page_n > 1){
          htmlstr=htmlstr+'<a class=page href=/content?page=1&cat_id=0&ContentType=Categories&filter='+filter+' title=Первая> << </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)-1)+'&cat_id=0&ContentType=Categories&filter='+filter+' title=Предыдущая> < </a>'
        }
        for(let i=0; i<data.pages_nav.length; i++){
          if(data.page_n==i){
            htmlstr=htmlstr+'<a class=page_activ href=/content?page='+i+'&cat_id=0&ContentType=Categories&filter='+filter+' title='+i+'> '+i+' </a>'
          }else{
            htmlstr=htmlstr+'<a class=page href=/content?page='+i+'&cat_id=Categories&ContentType=Categories&filter='+filter+' title='+i+'> '+i+' </a>'
          }
        }
        if(page_n < data.page_count){
          htmlstr=htmlstr+'<a class=page href=/content?page='+(Number(page_n)+1)+'&cat_id=0&ContentType=Categories&filter='+filter+' title=Следующая> > </a>'
          htmlstr=htmlstr+'<a class=page href=/content?page='+data.page_count+'&cat_id=0&ContentType=Categories&filter='+filter+' title=Последняя> >> </a>'
        }
        htmlstr=htmlstr+'</div>'
        document.getElementById("content_grid").innerHTML = htmlstr

      } else {

      }
      document.getElementById("loader").style.display = "none"
    }
  }
  xhttp.send(formData);
  HideEditCatWindow()
}




