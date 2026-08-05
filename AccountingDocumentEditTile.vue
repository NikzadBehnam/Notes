<template>
    <tile :title="isNew ? i18n('insert-multi-product') : i18n('edit-multi-product')" noContainerStyled>
        <div class="flex w-full h-full overflow-auto relative">
            <div v-if="!isLoading" class="flex flex-col px-4 py-6 sm:w-full md:w-full lg:w-7/12 xxl:w-5/12 mx-auto">
                <abc-form ref="form" class="flex flex-col w-full" @submit="submit">
                    <span class="flex border-b text-lg leading-6 font-semibold mx-2 pb-2 mb-4 items-baseline"
                        ><span class="text-label-secondary text-2xl font-bold mr-3">1</span
                        >{{ i18n("movement-file-step") }}</span
                    >

                    <!-- SALE/PURCHASE/RETURN -->
                    <div class="w-full mb-4">
                        <p class="mb-1 px-2">{{ i18n("sale-purchase-type-select") }}</p>
                        <div class="flex w-6/12 px-2">
                            <div class="flex w-full divide-x divide-border border" style="height: 37px">
                                <div
                                    v-for="e in transferTypesList"
                                    :key="e.id"
                                    class="flex items-center h-full space-x-2 w-6/12 px-2 transition duration-150 ease-in-out cursor-pointer hover:bg-bg-400"
                                    :class="documentType === e.id ? 'text-info-700' : 'text-primary-500'"
                                    @click="onToggleDocumentType(e.id)"
                                >
                                    <div
                                        class="flex items-center justify-center rounded-full transition duration-150 ease-in-out"
                                        :class="
                                            documentType === e.id
                                                ? 'bg-info-500 text-text-opposite'
                                                : 'bg-bg-500 text-primary-400'
                                        "
                                        style="width: 22px; height: 22px"
                                    >
                                        <i
                                            class="fa-regular"
                                            :class="
                                                e.id === 'purchase'
                                                    ? 'fa-arrow-down-to-line'
                                                    : e.id === 'sale'
                                                      ? 'fa-arrow-up-to-line'
                                                      : 'fa-arrow-rotate-left'
                                            "
                                            style="font-size: 11px"
                                        ></i>
                                    </div>
                                    <div class="text-sm font-semibold transition duration-150 ease-in-out">
                                        {{ e.label }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SUPPLIER - PURCHASE -->
                    <div v-if="isDocumentTypePurchase" class="flex w-full mb-4">
                        <abc-select
                            class="w-6/12 px-2"
                            :label="i18n('document-supplier')"
                            v-model="detail.supplier_id"
                            :rules="mandatoryRule"
                            @input="updateSupplierValidityAlert"
                        >
                            <option :value="undefined" :key="undefined">{{ "" }}</option>
                            <option v-for="e in unicSuppliers" :value="e.subject_id" :key="e.subject_id">
                                {{ e.subject_full_name }}
                                {{ e.subject_fiscal_code || e.subject_vat_number ? " - " : "" }}
                                {{ e.subject_fiscal_code }}
                                {{ e.subject_fiscal_code && e.subject_vat_number ? " - " : "" }}
                                {{ e.subject_vat_number }}
                            </option>
                        </abc-select>
                    </div>

                    <!-- SUPPLIER WITH RECIPIENT FIELD - RETURN -->
                    <div v-else-if="isDocumentTypeReturn" class="flex w-full mb-4">
                        <abc-select
                            class="w-6/12 px-2"
                            :label="i18n('document-supplier')"
                            v-model="detail.recipient_id"
                            :rules="mandatoryRule"
                            @input="updateSupplierValidityAlert"
                        >
                            <option :value="undefined" :key="undefined">{{ "" }}</option>
                            <option v-for="e in unicSuppliers" :value="e.subject_id" :key="e.subject_id">
                                {{ e.subject_full_name }}
                                {{ e.subject_fiscal_code || e.subject_vat_number ? " - " : "" }}
                                {{ e.subject_fiscal_code }}
                                {{ e.subject_fiscal_code && e.subject_vat_number ? " - " : "" }}
                                {{ e.subject_vat_number }}
                            </option>
                        </abc-select>
                    </div>

                    <!-- RECIPIENT - SALE-->
                    <div v-else-if="isDocumentTypeSale" class="flex w-full mb-4">
                        <abc-select
                            class="w-6/12 px-2"
                            :label="i18n('document-recipient')"
                            v-model="detail.recipient_id"
                            :rules="mandatoryRule"
                        >
                            <option :value="undefined" :key="undefined">{{ "" }}</option>
                            <option v-for="e in unicRecipients" :value="e.subject_id" :key="e.subject_id">
                                {{ e.full_name }}
                                {{ e.fiscal_code || e.vat_number ? " - " : "" }}
                                {{ e.fiscal_code }}
                                {{ e.fiscal_code && e.vat_number ? " - " : "" }}
                                {{ e.vat_number }}
                            </option>
                        </abc-select>
                    </div>

                    <!-- ATTACHMENT TYPE -->
                    <div class="flex w-full mb-4">
                        <abc-select
                            class="w-6/12 px-2"
                            :label="i18n('file-category')"
                            :value="detail.attachment_type"
                            @input="updateAttachmentType"
                            :rules="mandatoryRule"
                            :is-disabled="isDocumentTypeReturn"
                        >
                            <option v-for="e in attachmentTypes" :value="e.id" :key="e.id">{{ e.label }}</option>
                        </abc-select>
                    </div>
                    <!-- ATTACHMENT DESCRIPTION -->
                    <div class="flex w-full mb-4">
                        <abc-input
                            class="w-6/12 px-2"
                            :label="i18n('document-reference')"
                            v-model="detail.attachment_description"
                            :rules="mandatoryRule"
                        >
                        </abc-input>
                    </div>

                    <div class="flex w-full mb-4">
                        <!-- ATTACHMENT DATE-->
                        <abc-date-input
                            class="w-6/12 px-2"
                            :label="i18n('document-date')"
                            :value="detailIssueDate"
                            @input="
                                detailIssueDate = arguments[0];
                                updateSupplierValidityAlert();
                                productLoadingDate =
                                    isNew && detailIssueDate && productLoadingDate === null
                                        ? detailIssueDate
                                        : productLoadingDate;
                            "
                            :rules="mandatoryRule"
                        />
                        <!-- PRODUCT LOADING DATE-->
                        <abc-date-input
                            v-if="isNew"
                            class="w-6/12 px-2"
                            :label="i18n('product-operation-date')"
                            :value="productLoadingDate"
                            @input="onProductLoadingDateChange"
                        />
                    </div>
                    <abc-alert
                        v-if="showSupplierValidityAlert"
                        class="mb-4 mx-2"
                        is-error
                        :title="i18n('invalid-supplier')"
                        :messages="[i18n('supplier-not-valid-on-attachment-date')]"
                    />

                    <!-- ATTACHMENT FILE -->
                    <div class="flex w-full mb-4 mt-2">
                        <!-- <abc-file-input-drag-and-drop
                            class="w-full px-2"
                            v-model="documentFiles"
                            @file-change="checkReceiptFile"
                            :subTitle="
                                detail.attachment_type
                                    ? attachmentTypes.find(t => t.id === detail.attachment_type).label
                                    : ''
                            "
                        /> -->
                        <abc-file-input
                            class="w-full px-2"
                            :label="i18n('accounting-document-file')"
                            v-model="documentFiles"
                            :fake-value="receiptFakeFile"
                            @file-change="checkReceiptFile"
                            :buttons="receiptFakeFile || (documentFiles && documentFiles.length > 0) ? true : false"
                        >
                            <template #buttons>
                                <abc-tool-button
                                    v-if="receiptFakeFile || (documentFiles && documentFiles.length > 0)"
                                    @click="clearReceiptFile"
                                    is-secondary
                                    :title="i18n('clear-field')"
                                >
                                    <i class="abc-icon abc-icon-x text-xs"></i>
                                </abc-tool-button>
                            </template>
                        </abc-file-input>
                    </div>

                    <span class="flex border-b text-lg leading-6 font-semibold mx-2 pb-2 mb-4 items-baseline mt-4"
                        ><span class="text-label-secondary text-2xl font-bold mr-3">2</span
                        >{{ i18n("movement-products-step") }}</span
                    >

                    <!-- PRODUCT LIST -->
                    <div class="flex flex-col w-full px-2 mb-8">
                        <div class="flex flex-col w-full border rounded">
                            <div
                                class="flex justify-between w-full px-4 py-3"
                                :class="{ 'border-b': detailMovements.length > 0 }"
                            >
                                <div class="flex items-center font-semibold">
                                    {{
                                        detailMovements.length > 0
                                            ? detailMovements.length + " " + i18n("movement-products-count")
                                            : i18n("movement-add-products")
                                    }}
                                </div>
                                <div class="flex items-center">
                                    <abc-tool-button
                                        is-success
                                        @click="
                                            curProduct = null;
                                            openEditProductModal = true;
                                        "
                                        :title="i18n('add-product')"
                                    >
                                        <i class="fa-solid fa-plus" style="font-size: 14px" />
                                    </abc-tool-button>
                                </div>
                            </div>
                            <div
                                v-for="(r, i) in detailMovements"
                                :key="i"
                                class="flex justify-between w-full px-4 py-3"
                                :class="{
                                    'border-b': i !== detailMovements.length - 1,
                                    'bg-info-50':
                                        detailMovements.length > 1 &&
                                        productId &&
                                        r.movement &&
                                        r.movement.item_id &&
                                        productId == r.movement.item_id,
                                }"
                            >
                                <div class="flex items-center mr-3">
                                    <div
                                        class="flex justify-center items-center rounded-full"
                                        :class="documentType === 'purchase' ? 'bg-teal-50' : 'bg-rose-50'"
                                        style="height: 37px; width: 37px"
                                        v-abc-tooltip
                                        :title="
                                            documentType === 'purchase'
                                                ? i18n('movement-filter-load')
                                                : i18n('movement-filter-unload')
                                        "
                                    >
                                        <i
                                            class="fa-light"
                                            :class="
                                                documentType === 'purchase'
                                                    ? 'fa-arrow-down-to-line text-teal-500'
                                                    : 'fa-light fa-arrow-up-to-line text-rose-500'
                                            "
                                        ></i>
                                    </div>
                                </div>
                                <div class="flex justify-between items-center flex-grow space-x-3 justify-right">
                                    <div>
                                        <span class="flex flex-col mr-2">{{ getProductDescription(r) }}</span>
                                        <p class="text-sm pt-1">
                                            <span class="text-label-primary pr-2">{{ i18n("warehouse-info") }}</span>
                                            {{ r.ds_warehouse }}
                                        </p>
                                    </div>
                                    <span class="font-semibold pr-4">{{ getProductQuantity(r) }}</span>
                                </div>
                                <div class="flex items-center">
                                    <abc-tool-button
                                        is-secondary
                                        @click="removeProduct(i)"
                                        :title="isMovementBlocked(r) ? i18n('verified-movement-delete-not-allowed') : i18n('movement-product-remove')"
                                        :isDisabled="isMovementBlocked(r)"
                                    >
                                        <i class="fa-light fa-trash-can" style="font-size: 13px" />
                                    </abc-tool-button>
                                    <abc-tool-button
                                        is-info
                                        @click="editProduct(i)"
                                        :title="isMovementBlocked(r) ? i18n('verified-movement-edit-not-allowed') : i18n('movement-product-edit')"
                                        :isDisabled="isMovementBlocked(r)"
                                    >
                                        <i class="fa-light fa-pen-to-square" style="font-size: 14px" />
                                    </abc-tool-button>
                                </div>
                            </div>
                        </div>
                        <abc-alert
                            v-if="showProductRequiredAlert"
                            class="mb-4 mt-4"
                            is-error
                            :title="i18n('valid.mandatory-field')"
                            :messages="[i18n('insert-at-least-one-product')]"
                        />
                    </div>

                    <div class="sticky z-10 bg-bg-100 border-t bottom-0 mx-2 pt-2">
                        <abc-form-buttons
                            class="pb-6"
                            @save="submit"
                            @cancel="$emit('close-current-view')"
                            :has-continue="false"
                            :disable-confirm-button="disableFormButtons"
                        />
                    </div>
                </abc-form>
            </div>
        </div>

        <!-- EDIT PRODUCT MODAL -->
        <accounting-document-edit-product-modal
            v-if="openEditProductModal"
            @close="openEditProductModal = false"
            @on-submit="onInsertProductSubmit"
            :warehouses="warehouses"
            :warehouse-types="warehouseTypes"
            :products="detailMovements"
            :cur-element="curProduct"
            :product-loading-date="productLoadingDate"
        />
    </tile>
</template>

<script lang="ts">
import { Component, Vue, Inject, Ref, Watch, Mixins, Prop } from "vue-property-decorator";
import { TranslateResult } from "vue-i18n";
import AssetsModule, { MODULE_ID } from "../../../..";
import { MODULE_ID as FARM_REGISTRY_ID } from "@abaco/farm-registry/src/modules/farm-registry/index";
import { Farm } from "@abaco/farm-registry/src/modules/farm-registry/models/Farm";
import { FromStore } from "@abaco/web-common/src/app";
import { ToastOptions } from "@abaco/web-common/src/app/Toasted";
import {
    Warehouse,
    WarehouseWorker,
    MultipleProductsForm,
    MultipleProductsMovement,
    WarehouseType,
    MultipleProductsMovementDetail,
    MultipleProductsMovementDetailed,
    StockedItemLot,
    WarehouseRecipient,
} from "../../../../models/Warehouse";
import { Validable } from "@abaco/web-components/src/components/form/Validable";
import DateUtils from "../../../../mixins/DateUtils";
import WarehouseUtils from "../../../../mixins/WarehouseUtils";
import GlobalStateModule, {
    MODULE_ID as GLOBAL_STATE_ID,
} from "@abaco/portal-global-state/src/modules/global-state/index";
import AccountingDocumentEditProductModal from "./AccountingDocumentEditProductModal.vue";
import { EmptyPagedResults } from "@abaco/web-common/src/Paging";
import { AccountingDocumentDetail } from "../../../../models/AccountingDocument";

@Component({
    components: { AccountingDocumentEditProductModal },
})
export default class AccountingDocumentEditTile extends Mixins(DateUtils, WarehouseUtils) {
    @Inject() toast!: (message: string, options?: ToastOptions) => TranslateResult;
    @Inject(MODULE_ID) assetsModule!: AssetsModule;
    @Inject(GLOBAL_STATE_ID) globalState!: GlobalStateModule;

    @FromStore(FARM_REGISTRY_ID) farm!: Farm;
    @FromStore(FARM_REGISTRY_ID) currentCampaign!: number | null;
    @FromStore(MODULE_ID) curWarehouse!: Warehouse | null;
    @FromStore(MODULE_ID) fertilizerAuth!: boolean;
    @FromStore(MODULE_ID) fertilizerSuperAuth!: boolean;
    @FromStore(MODULE_ID) canEditCost!: boolean;

    @Prop() editId!: number | null;
    @Prop() productId!: number | null;

    @Ref("form") form!: Validable;
    private detail: MultipleProductsForm = {
        attachment_type: null,
        attachment_description: null,
        issue_date: null,
        supplier_id: null,
        recipient_id: null,
    };
    private detailMovements: MultipleProductsMovementDetailed[] = [];
    private disableFormButtons = false;
    private isLoading = true;
    private mandatoryRule = [(v: unknown) => !!v || this.i18n("valid.mandatory-field")];
    private showSupplierValidityAlert = false;
    private showProductRequiredAlert = false;
    private openEditProductModal = false;
    private documentFiles: File[] | null = null;
    private documentFile: File | null | undefined = undefined;
    private formFile: Blob | null | undefined = undefined;
    private receiptFakeFile: string | null = null;
    private detailIssueDate: Date | null = null;
    private productLoadingDate: Date | null = null;
    private suppliers: WarehouseWorker[] = [];
    private recipients: WarehouseRecipient[] = [];
    private warehouses: Warehouse[] = [];
    // warehousetypes list with no WATER
    private warehouseTypes: WarehouseType[] = [];
    private curElementDetail: AccountingDocumentDetail | null = null;
    private curProduct: MultipleProductsMovementDetailed | null = null;
    private productProgressiveId = 1;
    private documentType: "sale" | "purchase" | "return" = "purchase";

    private get isNew(): boolean {
        return this.editId === null ? true : false;
    }

    private get isDocumentTypePurchase(): boolean {
        return this.documentType === "purchase" ? true : false;
    }

    private get isDocumentTypeSale(): boolean {
        return this.documentType === "sale" ? true : false;
    }

    private get isDocumentTypeReturn(): boolean {
        return this.documentType === "return" ? true : false;
    }

    private updateAttachmentType(type: string) {
        this.detail.attachment_type = type;
    }

    private onToggleDocumentType(value: "sale" | "purchase" | "return") {
        this.detail.supplier_id = null;
        this.detail.recipient_id = null;
        this.showSupplierValidityAlert = false;

        if (value === "sale") {
            this.documentType = "sale";
        }

        if (value === "purchase") {
            this.documentType = "purchase";
        }

        if (value === "return") {
            this.documentType = "return";
        }

        this.detailMovements.forEach((m: MultipleProductsMovementDetailed) => {
            if (this.isDocumentTypePurchase) {
                m.movement.operation_type = "LOAD";
            } else if (this.isDocumentTypeSale) {
                m.movement.operation_type = "UNLOAD";
            } else if (this.isDocumentTypeReturn) {
                m.movement.operation_type = "UNLOAD_RESO";
            }
        });
    }

    @Watch("isDocumentTypeReturn")
    private onDocumentTypeChange() {
        if (this.isDocumentTypeReturn) {
            // "DELIVERY_NOTE"
            this.updateAttachmentType(this.attachmentTypes[0].id);
        } else {
            this.detail.attachment_type = "";
        }
    }

    async mounted() {
        this.isLoading = true;

        await Promise.all([this.loadSuppliers(), this.loadRecipients(), this.loadWarehouses(), this.loadDetail()]);
        if (!this.editId) {
            this.onToggleDocumentType("purchase");
        }
        this.updateSupplierValidityAlert();
        this.isLoading = false;
        await Promise.all([this.loadWarehouseType()]);
    }
    private async loadSuppliers() {
        const res = await this.assetsModule.warehouseApi.getWarehouseWorker(this.farm.pk_cuaa);
        this.suppliers = res;
    }
    private async loadRecipients() {
        const today = new Date();
        const currentYear = today.getFullYear();
        const res = await this.assetsModule.warehouseApi.getWarehouseClients(this.farm.pk_cuaa, currentYear);
        this.recipients = res;
    }

    private async warehouseName(warehouse_id: number | null) {
        if (warehouse_id) {
            const warehouseName = await this.assetsModule.warehouseApi.getWarehouse(this.farm.pk_cuaa, warehouse_id);
            return warehouseName.warehouse_description;
        }
    }

    private getWarehouseName(warehouse_id: number | null) {
        if (warehouse_id) {
            return this.warehouseName(warehouse_id);
        }
    }

    private async loadWarehouseType() {
        const res = await this.assetsModule.warehouseApi.getWarehouseTypes();
        this.warehouseTypes = res.filter((t) => t.warehouse_type != "WATER");
    }

    private get getAttachmentTagColor() {
        if (this.documentType === "sale") {
            return "rose";
        } else if (this.documentType === "purchase") {
            return "teal";
        } else {
            return "purple";
        }
    }

    private get getAttachmentTagTitle() {
        if (this.documentType === "sale") {
            return this.i18n("sale").toString();
        } else if (this.documentType === "purchase") {
            return this.i18n("purchase").toString();
        } else {
            return this.i18n("return").toString();
        }
    }

    private async loadWarehouses() {
        const page = new EmptyPagedResults();
        page.count = 300;
        const res = await this.assetsModule.warehouseApi.getWarehouses(this.farm.pk_cuaa, page);
        this.warehouses = res.records;
    }
    private async loadDetail() {
        if (this.editId) {
            this.curElementDetail = await this.assetsModule.warehouseApi.getAccountingDocument(
                this.farm.pk_cuaa,
                this.editId,
            );

            if (this.curElementDetail) {
                if (this.curElementDetail.operation_type === "UNLOAD") {
                    this.onToggleDocumentType("sale");
                }
                if (this.curElementDetail.operation_type === "LOAD") {
                    this.onToggleDocumentType("purchase");
                }
                if (this.curElementDetail.operation_type === "UNLOAD_RESO") {
                    this.onToggleDocumentType("return");
                }
            }
            this.detail = {
                attachment_type: this.curElementDetail.attachment_type ? this.curElementDetail.attachment_type : null,
                attachment_description: this.curElementDetail.attachment_description
                    ? this.curElementDetail.attachment_description
                    : null,
                issue_date: null,
                supplier_id: this.curElementDetail.supplier_id ? this.curElementDetail.supplier_id : null,
                recipient_id: this.curElementDetail.recipient_id ? this.curElementDetail.recipient_id : null,
            };
            this.detailIssueDate = this.curElementDetail.issue_date ? new Date(this.curElementDetail.issue_date) : null;
            if (
                this.curElementDetail.stock_document_id &&
                this.curElementDetail.file_repository_id &&
                this.curElementDetail.movements.length > 0
            ) {
                this.receiptFakeFile = await this.getFileDetail(
                    this.curElementDetail.movements[0].stock_item_id,
                    this.curElementDetail.stock_document_id,
                );
            }

            this.curElementDetail.movements.forEach((movement) => {
                let stockedLot: StockedItemLot | undefined = undefined;
                if (movement.expire_date || movement.production_date || movement.stocked_lot_number) {
                    stockedLot = {
                        lot_number: movement.stocked_lot_number,
                        expire_date: movement.expire_date ? movement.expire_date : null,
                        production_date: movement.production_date ? movement.production_date : null,
                    };
                }
                const movementDetail: MultipleProductsMovementDetail = {
                    item_id: movement.item_id ? movement.item_id : undefined,
                    operation_type: movement.operation_type ? movement.operation_type : undefined,
                    quantity: movement.quantity_abs ? movement.quantity_abs : undefined,
                    sco_unit_measure: movement.sco_unit_measure ? movement.sco_unit_measure : undefined,
                    sco_currency: movement.sco_currency ? movement.sco_currency : undefined,
                    stocked_lot_id: movement.stocked_lot_id ? movement.stocked_lot_id : undefined,
                    stocked_lot: stockedLot,
                    operation_date: movement.operation_date ? movement.operation_date : null,
                    unit_price: movement.unit_price ? movement.unit_price : undefined,
                    verified_date: movement.verified_date ? movement.verified_date : undefined,
                };
                this.detailMovements.push({
                    warehouse_id: movement.warehouse_id,
                    stock_type: movement.stock_type,
                    movement: movementDetail,
                    description: movement.item_name,
                    ds_warehouse: movement.warehouse_description,
                    ds_quantity: movement.ds_unit_measure,
                    physical_quantity: movement.physical_quantity,
                    persistent_id: movement.stocked_lot_id ? movement.stocked_lot_id : null,
                    local_id: this.productProgressiveId,
                });
                this.productProgressiveId++;
            });
        }
    }

    private get unicSuppliers(): WarehouseWorker[] {
        const res: WarehouseWorker[] = [];
        this.suppliers.filter((e) => {
            if (!this.isSupplierAvailableForDocumentDate(e)) {
                return;
            }
            if (!res.find((e1) => e.subject_id === e1.subject_id)) {
                res.push(e);
            }
        });
        return res;
    }
    private get unicRecipients(): WarehouseRecipient[] {
        const res: WarehouseRecipient[] = [];
        this.recipients.filter((e) => {
            if (!res.find((e1) => e.subject_id === e1.subject_id)) {
                res.push(e);
            }
        });
        return res;
    }

    private isSupplierAvailableForDocumentDate(supplier: WarehouseWorker): boolean {
        if (!this.detailIssueDate) {
            return true;
        }

        const selectedSupplierId = this.isDocumentTypePurchase ? this.detail.supplier_id : this.detail.recipient_id;
        if (supplier.subject_id === selectedSupplierId) {
            return true;
        }

        return this.isSupplierValidOnDocumentDate(supplier);
    }

    private isSupplierValidOnDocumentDate(supplier: WarehouseWorker): boolean {
        if (!this.detailIssueDate) {
            return true;
        }

        const startDate = supplier.start_date ?? null;
        const endDate = supplier.end_date ?? null;
        return (
            (startDate === null || startDate <= this.detailIssueDate) &&
            (endDate === null || endDate >= this.detailIssueDate)
        );
    }

    private isSelectedSupplierValid(): boolean {
        let supplierId: number | null = null;
        if (this.isDocumentTypePurchase) {
            supplierId = this.detail.supplier_id;
        }
        if (this.isDocumentTypeReturn) {
            supplierId = this.detail.recipient_id;
        }
        if (!supplierId || !this.detailIssueDate) {
            return true;
        }

        return this.suppliers.some((supplier) => {
            if (supplier.subject_id !== supplierId) {
                return false;
            }
            return this.isSupplierValidOnDocumentDate(supplier);
        });
    }

    private updateSupplierValidityAlert() {
        this.showSupplierValidityAlert = !this.isSelectedSupplierValid();
    }

    private async submit() {
        const isValid = this.form.validate();
        const hasAtLeastOneProduct = this.detailMovements.length > 0;
        this.updateSupplierValidityAlert();
        if (!hasAtLeastOneProduct) {
            this.showProductRequiredAlert = true;
            return;
        }
        if (this.showSupplierValidityAlert) {
            return;
        }
        if (isValid) {
            this.disableFormButtons = true;

            if (this.documentFile) {
                this.formFile = this.documentFile ? this.handleFileUpload(this.documentFile) : undefined;
            } else {
                if (this.curElementDetail && this.documentFile === null) {
                    this.formFile = null;
                }
            }

            if (this.detailIssueDate) {
                this.detailIssueDate.setHours(9);
                this.detail.issue_date = this.detailIssueDate.toISOString().split(".")[0].replace("T", " ");
            }

            try {
                const detailMovementsTemp: MultipleProductsMovement[] = this.detailMovements.map((e) => {
                    return {
                        warehouse_id: e.warehouse_id,
                        stock_type: e.stock_type,
                        movement: e.movement,
                    };
                });

                if (this.isNew) {
                    await this.assetsModule.warehouseApi.insertAttachmentWithProducts(
                        this.farm!.pk_cuaa,
                        this.detail,
                        this.formFile,
                        this.documentFile,
                        detailMovementsTemp,
                    );
                } else {
                    await this.assetsModule.warehouseApi.updateAttachmentWithProducts(
                        this.farm!.pk_cuaa,
                        this.editId!,
                        this.detail,
                        this.formFile,
                        this.documentFile,
                        detailMovementsTemp,
                        this.curElementDetail!.file_repository_id,
                    );
                }

                const message = this.isNew
                    ? this.i18n("multiple-products-inserted")
                    : this.i18n("multiple-products-updated");
                this.toast(message as string, { type: "success" });
                this.close();
                // this.reset();
            } catch (error) {
                this.toast(error as string, { type: "error" });
            } finally {
                this.disableFormButtons = false;
            }
        }
    }

    private onInsertProductSubmit(
        form: MultipleProductsMovementDetail,
        warehouseId: number,
        stockType: string,
        itemDescription: string,
        measureDs: string,
        warehouseDescription: string,
        physicalQuantity: string,
        localId: number | null,
        persistentId: number | null,
    ) {
        this.showProductRequiredAlert = false;
        const operationType = this.getOperationType();

        // insert
        if (localId === null) {
            const movement: MultipleProductsMovementDetailed = {
                warehouse_id: warehouseId,
                stock_type: stockType,
                movement: { ...form, operation_type: operationType },
                description: itemDescription,
                ds_quantity: measureDs,
                ds_warehouse: warehouseDescription,
                physical_quantity: physicalQuantity,
                persistent_id: persistentId,
                local_id: this.productProgressiveId,
            };
            this.productProgressiveId++;
            this.detailMovements.push(movement);
        } else {
            // update
            const temp = [...this.detailMovements];
            const index = temp.findIndex((e) => e.local_id === localId);
            if (index !== -1) {
                temp[index] = {
                    warehouse_id: warehouseId,
                    stock_type: stockType,
                    movement: { ...form, operation_type: operationType },
                    description: itemDescription,
                    ds_warehouse: warehouseDescription,
                    ds_quantity: measureDs,
                    physical_quantity: physicalQuantity,
                    persistent_id: persistentId,
                    local_id: localId,
                };
                this.detailMovements = temp;
            }
        }
        this.openEditProductModal = false;
    }

    private getOperationType(): string | undefined {
        if (this.isDocumentTypePurchase) {
            return "LOAD";
        } else if (this.isDocumentTypeSale) {
            return "UNLOAD";
        } else if (this.isDocumentTypeReturn) {
            return "UNLOAD_RESO";
        }
    }

    private getProductDescription(row: MultipleProductsMovementDetailed): string {
        let baseString = row.description;
        if (row.movement.stocked_lot && row.movement.stocked_lot.lot_number) {
            baseString = baseString + " - " + row.movement.stocked_lot.lot_number;
        }
        return baseString;
    }
    private getProductQuantity(row: MultipleProductsMovementDetailed): string {
        return row.movement.quantity + " " + row.ds_quantity;
    }

    private async checkReceiptFile(files: File[]) {
        if (files && files.length > 0) {
            this.documentFile = files[0];
        }
    }
    private async clearReceiptFile() {
        this.documentFiles = null;
        this.documentFile = null;
        this.receiptFakeFile = null;
        this.formFile = null;
    }
    private handleFileUpload(file: File): Blob {
        const fileIn = file as File;
        return new Blob([fileIn]);
    }
    private async getFileDetail(stockId: number, attachmentId: number): Promise<string> {
        const file: any = await this.assetsModule.warehouseApi.downloadAttachment(
            this.farm.pk_cuaa,
            stockId,
            attachmentId,
        );
        if (file) {
            const headersFilename = file[2];
            let filename = "";
            if (headersFilename && headersFilename.indexOf("inline") !== -1) {
                const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                const matches = filenameRegex.exec(headersFilename);
                if (matches != null && matches[1]) {
                    filename = matches[1].replace(/['"]/g, "");
                }
            }
            return filename;
        } else {
            return "";
        }
    }

    // private reset() {
    //     this.documentFiles = null;
    //     this.documentFile = undefined;
    //     this.receiptFakeFile = null;
    //     this.formFile = undefined;
    //     this.detailIssueDate = null;
    //     this.suppliers = [];
    //     this.detailMovements = [];
    //     this.detail = {
    //         attachment_type: null,
    //         attachment_description: null,
    //         issue_date: null,
    //         supplier_id: null
    //     };
    // }

    private isMovementBlocked(detailed_movement: MultipleProductsMovementDetailed): boolean {
        return detailed_movement.movement.verified_date !== undefined && detailed_movement.movement.verified_date !== null;
    }

    private removeProduct(index: number) {
        this.detailMovements.splice(index, 1);
    }
    private editProduct(index: number) {
        this.curProduct = this.detailMovements[index];
        this.openEditProductModal = true;
    }

    private close() {
        this.$emit("close-current-view");
    }

    private onProductLoadingDateChange(newDate: Date | null) {
        if (newDate) {
            const oldDate = this.productLoadingDate;
            this.productLoadingDate = newDate;
            this.detailMovements.forEach((m: MultipleProductsMovementDetailed) => {
                if (
                    !oldDate ||
                    (oldDate &&
                        m.movement.operation_date &&
                        (m.movement.operation_date as Date).getTime() === oldDate.getTime())
                ) {
                    m.movement.operation_date = newDate;
                }
            });
        }
    }
}
</script>

<style lang="scss"></style>
