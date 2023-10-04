import { Component } from '@angular/core';
import { GifsService } from 'src/app/gifs/services/gifs.service';

@Component({
  selector: 'shared-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {

  constructor( private gifsService: GifsService ) {}

  get tagList(): string[] {
    return this.gifsService.tagsHistory;
  }

  reloadTag( tag: string ): void {
    this.gifsService.tagSearch( tag );
  }

  public onDeleteTag( tag: string ): void {
    this.gifsService.tagDelete( tag );
  }

}
