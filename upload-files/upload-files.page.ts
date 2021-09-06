import { Component, OnInit } from '@angular/core';
import * as $ from "jquery";
import { NavController, NavParams,ModalController, AlertController, Platform } from '@ionic/angular';
import { GOODLISTURL} from "../../services/globalUrl";
import { Router,ActivatedRoute ,Params} from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { web3S} from "../../services/web3Storage";
@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.page.html',
  styleUrls: ['./upload-files.page.scss'],
})
export class UploadFilesPage implements OnInit {
  cid: string="";
  upfile : any=[];
  upfloder : any=[];
  back_id:number = 0;
  parent_id: number = 0;
  fileTit: string="";
  furl:string="";
  uid:string = "";
  bar_value: number=0.0;
  bar_type: string="determinate";
  constructor(
    private storage:Storage,
    public navCtrl: NavController,
    private router:Router,
    public activated: ActivatedRoute,
    public alertCtrl: AlertController,
    public web3S1: web3S,
  ) { }

  async ngOnInit() {
    await this.storage.create();
    this.storage.get('id').then((value) => {
      this.uid = value ;
      this.activated.params.subscribe((params: Params) => {
        if(params['parent_id']){
          this.parent_id = params['parent_id'];
        }
        if(params['back_id']){
          this.back_id = params['back_id'];
        }
        if(params['filename']){
          this.fileTit = params['filename'];
        }
        if(params['furl']){
          this.furl = params['furl'];
        }
      });
    });
  }
  fileSelected(e) { 
    $(".line").css("display","block");
    this.upfile = [];
    var files = e.target.files || e.dataTransfer.files;
    if (files) {
      for (var j = 0, file; file = files[j]; j++) {
        this.upfile.push(file);
      }
    } else {
      alert("没有选择文件!");
    }
  }
  
  async uploadFiles(){
    if(this.upfile == ""){
      alert("选择文件再提交");
      return;
    }
    $(".disable").css("display","block");
    this.bar_type = "indeterminate";
    //上传文件到ipfs
    const files = this.upfile;
    const client = this.web3S1.makeStorageClient()
    var cid = await client.put(files);

    var filesname=[];
    var flength = this.upfile.length;
    for(var i=0; i < flength; i++){
      filesname.push(this.upfile[i].name);
    }
    var url= GOODLISTURL + "/app_upload_file/upload";
    var that = this;
    $.ajax({
      type: "POST",
      url: url,
      data: {
        filesname:filesname,cid:cid,uid:that.uid,parent_id:that.parent_id,
      },
      dataType:"json",
      cache:false,
      success : function(data){
        $(".disable").css("display","none");
        if(data.status == "ok"){
          that.bar_value = 100.0;
          that.bar_type ="determinate";
          that.presentAlert("上传成功");
        }else{
          that.upfile = [];
          alert(data.status);
        }
          
      },error: function(data){
        that.upfile = [];
        alert("数据加载异常，请重试!");
      }
		});
  }

  //返回
  back(){
    //this.navCtrl.back();
    this.router.navigate(['file-store',{back_id:this.back_id,parent_id:this.parent_id,filename:this.fileTit}]);
  }
  //选择备份路径
  selUrl(){
    this.router.navigate(['file-sel',{back_id:this.back_id,parent_id:this.parent_id,filename:this.fileTit}]);
  }
  async presentAlert(content){
    const alert = await this.alertCtrl.create({
      header: '提示',
      message: content,
      buttons: [
        {
          text: '继续上传',
          handler: () => {
            this.upfile = [];
          }
        },
        {
          text: '返回列表',
          handler: () => {
            this.router.navigate(['file-store',{back_id:this.back_id,parent_id:this.parent_id,filename:this.fileTit}]);
          }
        }
      ]
    });
    await alert.present();
  }
}
