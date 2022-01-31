import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';


import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '@app/core/services/alert.service';
import { Plugin } from '@app/core/models/plugin';
import { PluginConfigOption } from '@app/core/models/plugin-config-option';
import { PluginConfigItem } from '@app/core/models/plugin-config-item';
import { PluginConfigItemService } from '@app/core/services/plugin-config-item.service';
import { ResponseError } from '@app/core/models/response-error';


@Component({
  selector: 'app-plugin-new',
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  loading: boolean = false;
  pluginItemForm!: FormGroup;
  plugin!: Plugin;
  
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private pluginConfigItemService: PluginConfigItemService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.plugin = { ...<Plugin>this.route.snapshot.data.plugin };

    this.pluginItemForm = this.formBuilder.group({
      pluginConfigs: this.formBuilder.array([]),
    });

    if (this.plugin.newItemPluginConfigOptions) {
      this.renderPluginConfigOptions(this.plugin.newItemPluginConfigOptions);
    }

    this.pluginConfigItemService.onAdd$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((pluginConfigItem: PluginConfigItem) => {
      this.loading = false;
      this.alertService.success('OK', 'Settings were saved.');
    });

    this.pluginConfigItemService.onAddError$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((responseError: ResponseError) => {
      this.loading = false;
      this.alertService.error(responseError.code.toString(), responseError.message);
    });
  }

  renderPluginConfigOptions(pluginConfigOptions: PluginConfigOption[]) {
    const pluginConfigs = this.pluginItemForm.get('pluginConfigs') as FormArray;
    pluginConfigOptions.forEach((pluginConfigOption: PluginConfigOption) => {
        pluginConfigs.push(this.createPluginConfigOption(pluginConfigOption));
    });
  }

  createPluginConfigOption(pluginConfigOption: PluginConfigOption) {
    const valueValidators = (pluginConfigOption.validators ? this.pluginConfigItemService.processValidators(pluginConfigOption.validators) : []);
    return this.formBuilder.group({
      pluginConfigOption: [pluginConfigOption],
      value: [pluginConfigOption.defaultValue, valueValidators],
    });
  }

  getPluginConfigsControls() {
    return (this.pluginItemForm.get('pluginConfigs') as FormArray).controls;
  }

  get rf() { return this.pluginItemForm.controls; }

  onSubmit() {

    // stop here if form is invalid
    if (this.pluginItemForm.invalid) {
        return;
    }

    this.loading = true;

    const pluginConfigOptions: PluginConfigOption[] = [];
    this.rf.pluginConfigs.value.forEach((pluginConfigOptionValue: any) => {
      const pluginConfigOption = <PluginConfigOption>pluginConfigOptionValue.pluginConfigOption;
      pluginConfigOption.value = pluginConfigOptionValue.value;
      pluginConfigOptions.push(pluginConfigOption);
    });

    const pluginConfigItem = <PluginConfigItem>{
      pluginConfigOptions: pluginConfigOptions
    };

    this.pluginConfigItemService.addPluginConfigItem(pluginConfigItem, this.plugin);
  }


  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
