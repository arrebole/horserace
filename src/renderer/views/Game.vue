
<template>
    <article class="p-2">
        <section>
            <div class="text-xs shadow-md">
                <TeamTable teamName="teamOne" :summoners="gameflow.teamOne" />
            </div>
        </section>

        <section>
            <div class="h-3"></div>
        </section>

        <section class="text-xs shadow-md">
            <TeamTable teamName="teamTwo" :summoners="gameflow.teamTwo" />
        </section>
    </article>
</template>
  
<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useStore } from "../store";
import TeamTable from "../components/TeamTable.vue";

const { gameflow } = storeToRefs(useStore());

</script>