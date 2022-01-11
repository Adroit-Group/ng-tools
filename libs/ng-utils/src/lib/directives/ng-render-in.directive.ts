/* eslint-disable @angular-eslint/directive-selector */
/* eslint-disable @angular-eslint/no-input-rename */
/* eslint-disable max-classes-per-file */
import {
  Directive,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';

import { EApplicationPlatform } from '../enums';
import { PlatformObserverService } from '../services';

/**
 * A structural directive that allows the rendering on templates based on the platform the application is running on.
 * The typical use case of the directive is to enable the usage of different templates for different rendering modes, eg.: usae a different view when the application is ran in SSR.
 *
 * @example ```html
 * <app-splash-screen *ngRenderIn="'browser'"></app-splash-screen>
 * ```
 *
 * There are two utility versions of this directive
 * NgRenderInBrowser (*ngRenderInBrowser) and NgRenderInServer (*ngRenderServer)
 * that do exactly what their names suggest.
 */
@Directive({
  selector: '[ngRenderIn]',
})
export class NgRenderInDirective implements OnInit, OnDestroy {
  @Input('ngRenderInElse') public alternativeTemplate?: TemplateRef<unknown>;

  @Input('ngRenderIn') public platform!: EApplicationPlatform;

  protected _embeddedView!: EmbeddedViewRef<unknown>;

  constructor(
    protected readonly vcr: ViewContainerRef,
    protected readonly templateRef: TemplateRef<unknown>,
    protected readonly platformObserver: PlatformObserverService
  ) {}

  public ngOnInit(): void {
    if (this.platformObserver.platformID === this.platform) {
      this._embeddedView = this.vcr.createEmbeddedView(this.templateRef);
    } else if (this.alternativeTemplate) {
      this._embeddedView = this.vcr.createEmbeddedView(
        this.alternativeTemplate
      );
    }
  }

  public ngOnDestroy(): void {
    if (!this._embeddedView.destroyed) {
      this._embeddedView.destroy();
    }
  }
}

/**
 * A structural directive that only renders it's template if the application is ran in the browser.
 *
 * @example ```html
 * <app-splash-screen *ngRenderInBrowser></app-splash-screen>
 * ```
 */
@Directive({
  selector: '[ngRenderInBrowser]',
})
export class NgRenderInBrowserDirective extends NgRenderInDirective {
  @Input('ngRenderIn')
  public readonly platform = EApplicationPlatform.Browser;

  @Input('ngRenderInBrowserElse')
  public alternativeTemplate?: TemplateRef<unknown>;
}

/**
 * A structural directive that only renders it's template if the application is ran in the server environment (SSR).
 *
 * @example ```html
 * <app-splash-screen *ngRenderInServer></app-splash-screen>
 * ```
 */
@Directive({
  selector: '[ngRenderInServer]',
})
export class NgRenderInServerDirective extends NgRenderInDirective {
  @Input('ngRenderIn')
  public readonly platform = EApplicationPlatform.Server;

  @Input('ngRenderInServerElse')
  public alternativeTemplate?: TemplateRef<unknown>;
}
