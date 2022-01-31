import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, EmailValidator, MaxLengthValidator, Validator } from '@angular/forms';


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
  selector: 'app-plugin-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  private componentDestroyed$: Subject<boolean> = new Subject();
  loading: boolean = false;
  pluginItemForm!: FormGroup;
  plugin!: Plugin;
  pluginConfigItem!: PluginConfigItem;
  


  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private pluginConfigItemService: PluginConfigItemService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.plugin = { ...<Plugin>this.route.snapshot.data.plugin };
    this.pluginConfigItem = { ...<PluginConfigItem>this.route.snapshot.data.pluginConfigItem };

    this.pluginItemForm = this.formBuilder.group({
      pluginConfigs: this.formBuilder.array([]),
    });

    this.renderPluginConfigOptions(this.pluginConfigItem.pluginConfigOptions);


    this.pluginConfigItemService.onSet$.pipe(
      takeUntil(this.componentDestroyed$)
    ).subscribe((pluginConfigItem: PluginConfigItem) => {
      this.loading = false;
      this.alertService.success('OK', 'Settins were saved.');
    });

    this.pluginConfigItemService.onSetError$.pipe(
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

    const value = (pluginConfigOption.value === null ? pluginConfigOption.defaultValue : pluginConfigOption.value);

    return this.formBuilder.group({
      pluginConfigOption: [pluginConfigOption],
      value: [value, valueValidators],
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
    this.rf.pluginConfigs.value.forEach((pluginConfigOptionValue: any) => {
      const foundIndex = this.pluginConfigItem.pluginConfigOptions.findIndex(x => x.key === pluginConfigOptionValue.pluginConfigOption.key);
      if (foundIndex != -1) {
        this.pluginConfigItem.pluginConfigOptions[foundIndex].value = pluginConfigOptionValue.value;
      }
    });

    this.pluginConfigItemService.setPluginConfigItem(this.pluginConfigItem, this.plugin);
  }


  ngOnDestroy() {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}

