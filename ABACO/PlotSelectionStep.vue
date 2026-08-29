<template>
    <div class="relative flex flex-col w-full h-full min-h-0 px-4 pt-4 lg:w-full xxl:w-full md:w-full xxl:px-4">
        <!-- SELECT BLOCKS MODAL -->
        <abc-modal
            modal-class="w-full md:w-10/12 lg:w-6/12 xxl:w-4/12"
            top-pinned
            show-navbar
            no-padding
            full-height
            v-if="openBlockSelectionModal"
            :title="i18n('select-blocks')"
            @close="openBlockSelectionModal = false"
            @submit="openBlockSelectionModal = false"
        >
            <template #body>
                <div class="flex flex-col h-full px-8 overflow-auto">
                    <div
                        class="sticky top-0 z-10 flex flex-col items-center justify-between w-full px-3 pt-3 bg-bg-100"
                    >
                        <abc-input class="w-full" v-model="blockSearch" left-tools :placeholder="i18n('search')">
                            <template #left><i class="abc-icon abc-icon-lens"/></template>
                        </abc-input>
                        <div class="flex w-full pt-3 border-b"></div>
                    </div>
                    <div class="flex flex-col w-full pt-2">
                        <transition
                            appear
                            name="custom-classes-transition"
                            enter-active-class="animate__animated animate__fadeIn animate__faster"
                            leave-active-class="animate__animated animate__fadeOut animate__faster"
                            mode="out-in"
                        >
                            <template v-if="!blockListLoading && blockLists.length > 0">
                                <div class="flex flex-col px-3">
                                    <div v-for="(p, iP) in blockLists" :key="iP" class="flex flex-col mt-2 mb-2">
                                        <div
                                            v-if="blocksFiltered(p.plot.plot_id).length > 0"
                                            class="flex mb-1 font-semibold text-primary-300"
                                        >
                                            <span>{{ p.plot.plot_name || p.plot.plot_code }}</span>
                                        </div>
                                        <div
                                            v-if="blocksFiltered(p.plot.plot_id).length > 0"
                                            class="flex flex-col w-full"
                                        >
                                            <ul class="activity-block-list">
                                                <li
                                                    v-for="(b, iB) in blocksFiltered(p.plot.plot_id)"
                                                    :key="iB"
                                                    @click="onBlockClick(b, p.plot.plot_id)"
                                                    class="outline-none activity-block-list-item"
                                                    :class="{ active: isBlockSelected(b) }"
                                                >
                                                    <abc-checkbox is-list :value="isBlockSelected(b)" />
                                                    <div class="flex items-baseline justify-between w-full pl-3">
                                                        <span class="">{{ b.block_code }}</span>
                                                        <span class="text-xl">
                                                            {{ b.declared_area / 10000 }}
                                                            <span class="text-base text-secondary-500">ha</span>
                                                        </span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </template>
                            <template v-if="blockListLoading">
                                <abc-loader class="h-10 pb-6 mt-10 mb-4" />
                            </template>
                            <template v-if="!blockListLoading && blockLists.length === 0">
                                <div class="flex justify-center w-full py-4 text-label-secondary">
                                    {{ i18n("no-blocks") }}
                                </div>
                            </template>
                        </transition>
                    </div>
                </div>
            </template>
            <template #footer>
                <abc-button is-success is-outlined @click="openBlockSelectionModal = false">{{
                    i18n("done")
                }}</abc-button>
            </template>
        </abc-modal>

        <!-- SELECT BLOCKS AND SUB-BLOCKS LIST -->
        <sub-blocks-selection-list
            v-if="showSubBlockList"
            :computedHideRotations="computedHideRotations"
            :groups="groups"
            @close="showSubBlockList = false"
        />
        <!-- SELECT PLOT LIST -->
        <div
            v-else
            class="flex flex-col flex-grow min-h-0"
            :class="hasPlotTableVirtualScroll ? 'overflow-hidden' : 'overflow-y-auto'"
        >
            <plot-table-component
                :plots="filteredByBioPlots"
                :totalCount="plotCount"
                :selected-plots.sync="selectedPlots"
                :loading="loading"
                :navbarCurPlotGroup="isColdiretti ? curPlotGroup : null"
                show-filter
                show-groups
                :fields="fields"
                :virtualScrollColumnWidths="virtualScrollColumnWidths"
                has-additional-filters
                borderLess
                noOverflow
                :compactFilters="true"
                :showPlotPreview="isColdiretti"
                @groupChanged="onGroupChangedFromTable"
                @filteredPlots="onTableFilteredPlots"
            >
                <template #additional-filters>
                    <abc-checkbox v-model="showOnlyBio" :label="i18n('only-bio')" class="mt-4" />
                </template>
                <template #additional-filters-right>
                    <!-- <abc-checkbox v-model="showSubBlockList" :label="i18n('search-by-sub-blocks')" class="mt-3 ml-6" /> -->
                    <div class="flex w-full">
                        <abc-tool-button
                            @click="showSubBlockList = false"
                            is-secondary
                            :is-active="!showSubBlockList"
                            class="w-6/12"
                        >
                            <span>{{ i18n("plots") }}</span>
                        </abc-tool-button>
                        <abc-tool-button
                            @click="showSubBlockList = true"
                            is-secondary
                            :is-active="showSubBlockList"
                            class="w-6/12"
                        >
                            <span>{{ i18n("blocks") }}</span>
                        </abc-tool-button>
                    </div>
                </template>
            </plot-table-component>
        </div>

        <div class="sticky bottom-0 z-10 flex flex-shrink-0 w-full border-t bg-bg-100">
            <div class="flex pt-4 pb-4">
                <abc-button is-outlined is-secondary @click="activityConfigured = null">
                    <i class="mr-2 fa-light fa-chevron-left"></i>
                    {{ i18n("back") }}
                </abc-button>
                <abc-button :is-disabled="selectedPlots.length > 0 ? false : true" @click="curStep = curStep + 1">
                    <i class="mr-2 fa-light fa-chevron-right"></i>
                    {{ i18n("next") }}
                </abc-button>
            </div>
            <div
                class="flex justify-end flex-grow pt-2 pb-4 mt-2"
                v-if="!isProtocol && selectedPlots.length > 0 && activityConfigured && !showSubBlockList"
            >
                <div class="flex px-4 py-2 mr-2 rounded bg-bg-500">
                    <span class="mr-1 font-semibold">{{ selectedBlocks.length }}</span>
                    <span>{{ i18n("blocks-selected") }}</span>
                </div>
                <abc-button is-outlined is-secondary @click="openBlockSelectionModal = true">
                    <i class="text-lg abc-icon abc-icon-square-2" />
                    {{ i18n("select-blocks") }}
                </abc-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import CropPlanModule from "@abaco/crop-plan-module/src/modules/crop-plan-module";
import { Block } from "@abaco/crop-plan-module/src/modules/crop-plan-module/models/Block";
import { MODULE_ID as FARM_REGISTRY_ID } from "@abaco/farm-registry/src/modules/farm-registry/index";
import { Farm } from "@abaco/farm-registry/src/modules/farm-registry/models/Farm";
import GlobalStateModule, {
    MAX_PLOT_COUNT_BEFORE_OPTIMIZATION,
    MODULE_ID as GLOBAL_STATE_ID
} from "@abaco/portal-global-state/src/modules/global-state/index";
import { Plot, PlotGroup } from "@abaco/portal-global-state/src/modules/global-state/models/Plot";
import { FromStore } from "@abaco/web-common/src/app";
import { EmptyPagedResults } from "@abaco/web-common/src/Paging";
import cloneDeep from "lodash/cloneDeep";
import { TranslateResult } from "vue-i18n";
import { Component, Inject, Vue, Watch } from "vue-property-decorator";
import { MODULE_ID } from "../../";
import { ActivityOrAction, FormType } from "../../models/Activity";
import { PlotBlock, toPlotBlock } from "../../models/Block";
import SubBlocksSelectionList from "./optionalStepComponents/SubBlocksSelectionList.vue";
import SSOModule, { MODULE_ID as SSO_WEB_MODULE } from "@abaco/sso-web-module/src/abaco-module";
import { ToastOptions } from "@abaco/web-common/src/app/Toasted";


interface BioPlot extends Plot {
    is_bio_string: string;
}

@Component({
    components: {
        SubBlocksSelectionList
    }
})
export default class PlotSelectionStep extends Vue {
    @Inject() i18n!: (key: string, values?: unknown) => TranslateResult;
    @Inject(GLOBAL_STATE_ID) globalState!: GlobalStateModule;
    @Inject(CropPlanModule.MODULE_ID) cropPlanModule!: CropPlanModule;
    @Inject() toast!: (message: string, options: ToastOptions) => void;

    @Inject(SSO_WEB_MODULE) ssoWebModule!: SSOModule;

    @FromStore(MODULE_ID) selectedPlots!: Plot[];
    @FromStore(MODULE_ID) selectedBlocks!: PlotBlock[];
    @FromStore(MODULE_ID) curStep!: number;
    @FromStore(FARM_REGISTRY_ID) farm!: Farm;
    @FromStore(FARM_REGISTRY_ID) currentCampaign!: number;
    @FromStore(GLOBAL_STATE_ID) plots!: Plot[];
    @FromStore(GLOBAL_STATE_ID) plotCount!: number;
    @FromStore(MODULE_ID) curFormType!: FormType | null;
    @FromStore(MODULE_ID) activityConfigured!: ActivityOrAction | null;
    @FromStore(MODULE_ID) isProtocol!: boolean;
    @FromStore(GLOBAL_STATE_ID) curPlotGroup!: PlotGroup | null;

    private loading = true;
    private showOnlyBio = false;
    private showSubBlockList = false;
    private openBlockSelectionModal = false;
    private blockListLoading = false;

    private blockSearch = "";
    private blockLists: any[] = [];
    private plotsChangedFromLastOpen = false;
    private computedHideRotations = true;
    private groups: PlotGroup[] = [];
    private ignoreAgmGuard = false;

    @Watch("showSubBlockList")
    private onSubBlockListChange() {
        this.selectedBlocks = [];
        this.selectedPlots = [];
    }

    private get fields() {
        return !this.isColdiretti
            ? {
                  plot_name: "plot",
                  crop_label: "crop",
                  council_label: "council",
                  is_bio_string: "is-bio"
              }
            : {
                  plot_name: "plot",
                  crop_label: "crop",
                  council_label: "council",
                  is_bio_string: "is-bio",
                  declared_area: "declared_area"
              };
    }
    private get virtualScrollColumnWidths(): string[] {
        return !this.isColdiretti ? ["30%", "40%", "30%", "220px"] : ["30%", "40%", "30%", "220px", "20%"];
    }

    private get hasPlotTableVirtualScroll(): boolean {
        return this.plotCount > MAX_PLOT_COUNT_BEFORE_OPTIMIZATION;
    }
  
    private get filteredByBioPlots() {
        let res = this.showOnlyBio
            ? this.filteredPlots?.filter(p => p.is_bio_string == this.i18n("yes")) || []
            : this.filteredPlots;

        if (this.isColdiretti && this.curPlotGroup?.plot_group_id) {
            const groupId = this.curPlotGroup.plot_group_id;
            res = res.filter(p => p.plot_group_id === groupId);
        }

        return res;
    }

    @Watch("filteredByBioPlots", { immediate: true })
    private onEligiblePlotsChanged() {
        this.$emit("eligible-plots-changed", this.filteredByBioPlots);
    }

    private onTableFilteredPlots(plots: Plot[]) {
        this.$emit("eligible-plots-changed", plots);
    }

    async mounted() {
        this.loading = true;
        await this.globalState.plotApi.loadAllPlots(this.farm.pk_cuaa, this.currentCampaign, true, false);
        this.onCurFormType();
        this.loading = false;
        this.loadPlotSettings();
        this.loadGroups();
    }

    private onUpdateFilteredPlots(updatedPlots: Plot[]) {
        if (!this.isColdiretti) {
            this.selectedPlots = [];
            return;
        }
        if (updatedPlots.length === 0) {
            this.curPlotGroup = null;
            return;
        }

        const uniqueGroupIds = new Set(updatedPlots.map(p => (p as any).plot_group_id ?? null));

        if (uniqueGroupIds.size === 1) {
            const [onlyGroupId] = Array.from(uniqueGroupIds);
            this.curPlotGroup = this.groups.find(g => g.plot_group_id === onlyGroupId) || null;
        } else {         
            this.curPlotGroup = null;
        }
    }
    private async loadPlotSettings() {
        if (this.farm) {
            const plotSettings = await this.globalState.plotApi.getPlotSettings(this.farm.pk_cuaa);
            this.computedHideRotations = !plotSettings.rotations_available;
        }
    }
    private async loadGroups() {
        if (this.farm) {
            this.groups = (
                await this.globalState.plotApi.getPlotGroups(this.farm.pk_cuaa, { count: 300, offset: 0 })
            ).records;
        }
    }

    private get filteredPlots() {
        const res = this.plots.map(p => ({
            ...p,
            is_bio_string: p.fg_bio > 0 ? this.i18n("yes") : this.i18n("no")
        })) as BioPlot[];
        if (!this.curFormType) {
            return res;
        }
        return res.filter(p => p.form_types.find(f => f === this.curFormType?.frm_type_id));
    }

    private onGroupChangedFromTable(e: PlotGroup | null) {
        this.selectedPlots = [];
        this.curPlotGroup = e;
    }

    @Watch("curPlotGroup")
    private onCurPlotGroupChanged() {        
        if (!this.isColdiretti) return;             
        if (!this.curPlotGroup) {            
            this.selectedPlots = [];
            return;
        }
        
        const groupId = this.curPlotGroup?.plot_group_id ?? null;
        if (!groupId) return;        

        const groupPlots = this.filteredPlots.filter(p => p.plot_group_id === groupId);        
        this.selectedPlots = [...groupPlots];
        
    }

    private get isColdiretti() {
        return this.ssoWebModule.environment.includes("coldiretti");
    }

    @Watch("curFormType")
    onCurFormType() {
        this.selectedPlots = this.selectedPlots.filter(p =>
            p.form_types.find(f => f === this.curFormType?.frm_type_id)
        );
    }

    @Watch("openBlockSelectionModal")
    private async onBlockSelectionOpen() {
        if (this.openBlockSelectionModal && this.plotsChangedFromLastOpen) {
            this.blockSearch = "";
            this.blockListLoading = true;
            this.blockLists = [];
            if (this.selectedPlots.length > 0) {
                const page = new EmptyPagedResults();
                page.count = 300;
                await Promise.all(
                    this.selectedPlots.map(async e => {
                        const res = await this.cropPlanModule.blockApi.getBlocks(e.plot_id, null, null, page);
                        if (res.totalcount > 0) {
                            const el = { plot: e, blocks: res.records };
                            this.blockLists.push(el);
                        }
                    })
                );
            }
            this.blockListLoading = false;
            this.plotsChangedFromLastOpen = false;
        }
    }

    private blocksFiltered(plotId: number): any[] {
        if (this.blockSearch) {
            const filter = this.blockSearch.toLowerCase();
            const curBlocks = this.blockLists.find(e => e.plot.plot_id === plotId).blocks;
            return curBlocks.filter((b: any) => b.block_code.toLowerCase().indexOf(filter) > -1);
        } else {
            return this.blockLists.find(e => e.plot.plot_id === plotId).blocks;
        }
    }

    @Watch("selectedPlots")
    private onPlotsUpdate(newPlots: Plot[]) {        
        if (this.ignoreAgmGuard) {
            this.ignoreAgmGuard = false;
            return;
        }
        this.plotsChangedFromLastOpen = true;
        this.selectedBlocks.forEach(b => {
            if (!this.selectedPlots.find(p => p.plot_id === b.plot_id)) {
                let tempBlocks = cloneDeep(this.selectedBlocks);
                tempBlocks = tempBlocks.filter(b1 => b1.block_id !== b.block_id);
                this.selectedBlocks = tempBlocks;
            }
        });
        const agmCodes = Array.from(new Set(newPlots.map(p => (p as Plot).agm_group_code ?? null)));
        if (agmCodes.length > 1) {
            this.ignoreAgmGuard = true;
            const keepCode = agmCodes[0];
            this.selectedPlots = newPlots.filter(p => ((p as Plot).agm_group_code ?? null) === keepCode);
            this.toast(this.i18n("agm-group-multispecies-not-allowed").toString(), { type: "warn", duration: 5000 });
        }
    }

    private onBlockClick(e: Block, plotId: number) {
        let tempBlocks = cloneDeep(this.selectedBlocks);
        if (tempBlocks.some(b => b.block_id === e.block_id)) {
            //deselect
            tempBlocks = tempBlocks.filter(b => b.block_id !== e.block_id);
        } else {
            //select
            tempBlocks.push(toPlotBlock(e, plotId));
        }
        this.selectedBlocks = tempBlocks;
    }
    private isBlockSelected(e: Block) {
        return this.selectedBlocks.find(s => s.block_id === e.block_id) ? true : false;
    }
}
</script>

<style lang="scss">
.activity-block-list-item {
    @apply transition-all duration-150 ease-in-out relative;
}

.activity-block-list-item {
    @apply px-4 py-2 flex items-center cursor-default relative;
}

.activity-block-list-item::after {
    content: "";
    @apply absolute bg-border;
    height: 1px;
    left: 1rem;
    right: 0;
    bottom: 0px;
}
.activity-block-list .activity-block-list-item:last-of-type::after {
    content: none;
}
.activity-block-list-item {
    @apply cursor-pointer;
}
.activity-block-list-item:hover {
    @apply bg-bg-500;
}

.activity-block-list {
    @apply relative overflow-auto border border-border;
    outline: none !important;
}
</style>
