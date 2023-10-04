import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({ providedIn: 'root' })
export class GifsService {

  public gifList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private api_Key:      string = 'UOTz2LnOr1KDyXqgbBRueKSlSq2x5TIe';
  private serviceUrl:   string = 'https://api.giphy.com/v1/gifs/search';
  // gifs | stickers

  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
   }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  tagsOrganize( tag: string ): void {
    if ( tag === '' ) return;
    if ( this._tagsHistory.includes(tag) ) {
      this._tagsHistory = this._tagsHistory.filter( oldTag => oldTag !== tag );
    }
    this._tagsHistory.unshift( tag );
    this._tagsHistory = this._tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify( this._tagsHistory ) );
  }

  private loadLocalStorage(): void {
    if ( !localStorage.getItem('history') ) return;
    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );
    if ( this._tagsHistory.length>0 ) this.tagSearch( this._tagsHistory[0] );
  }

  tagSearch( tag: string): void {
    tag = tag.trim().toLowerCase();

    this.tagsOrganize( tag );

    const params = new HttpParams()
      .set( 'api_key', this.api_Key )
      .set( 'q', tag )
      .set( 'limit', '12' );

    this.http.get<SearchResponse>( `${this.serviceUrl}`, { params: params } )
      .subscribe( resp => {
        this.gifList = resp.data;
        // console.log({ gifs: this.gifList });
      }) ;

  }

  tagDelete( tag: string ): void {

    let nextTag: number = this._tagsHistory.findIndex( item => item === tag);
    this._tagsHistory = this._tagsHistory.filter( item => item !== tag );
    this.saveLocalStorage();
    if ( nextTag > this._tagsHistory.length ) nextTag = this._tagsHistory.length;
    if ( nextTag >= 0 ) this.tagSearch( this._tagsHistory[nextTag] );
  }

}

