import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { Plugins } from "@capacitor/core";
import { ToastController } from "@ionic/angular";

const { Network } = Plugins;

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage {
  apiData: any;
  limit = 2;

  constructor(
    private http: HttpClient,
    public toastController: ToastController
  ) {
    this.toastController.create({ animated: false }).then((t) => {
      t.present();
      t.dismiss();
    });
  }
  async presentToast() {
    const toast = await this.toastController.create({
      message: "T'as perdu la co bro :'(",
      duration: 2000,
    });
    toast.present();
  }
  ionViewWillEnter() {
    this.getData();
    let handler = Network.addListener("networkStatusChange", (status) => {
      if (!status.connected) {
        // alert("Attention ! T'as pas de co bro :/");
        this.presentToast();
      }
      console.log("Network status changed", status);
    });
  }

  getData(event = undefined) {
    const URL = "https://picsum.photos/v2/list?limit=" + this.limit;
    this.http.get(URL).subscribe((data) => {
      this.apiData = data;
      this.apiData.reverse();
      if (event) event.target.complete();
      console.log("Données récupérer : ", data);
    });
  }

  doRefresh(event) {
    console.log("Begin async operation");
    this.limit += 5; //Pour la limite, on incrémente ici
    this.getData(event); // On ajoute des données supplémentaires
    setTimeout(() => {
      console.log("Async operation has ended");
      event.target.complete();
    }, 2000);
  }
}
