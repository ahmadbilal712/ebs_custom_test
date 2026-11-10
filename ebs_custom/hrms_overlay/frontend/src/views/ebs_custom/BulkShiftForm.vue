<template>
	<ion-page>
		<ion-content class="ion-padding">
			<div class="flex flex-col w-full sm:w-96 gap-4 p-4">
				<header class="flex flex-row items-center">
					<Button variant="ghost" class="!pl-0" @click="router.back()">
						<FeatherIcon name="chevron-left" class="h-5 w-5" />
					</Button>
					<h2 class="text-xl font-semibold text-gray-900">{{ __("Assign Shift") }}</h2>
				</header>

				<label class="text-sm text-gray-700">{{ __("Branch") }}</label>
				<select v-model="branch" class="border rounded px-3 py-2" @change="load">
					<option value="">{{ __("All Branches") }}</option>
					<option v-for="name in formData.data?.branches || []" :key="name" :value="name">{{ name }}</option>
				</select>

				<label class="text-sm text-gray-700">{{ __("Shift Type") }}</label>
				<select v-model="shiftType" class="border rounded px-3 py-2">
					<option value="">{{ __("Select") }}</option>
					<option v-for="name in formData.data?.shift_types || []" :key="name" :value="name">{{ name }}</option>
				</select>

				<label class="text-sm text-gray-700">{{ __("Start Date") }}</label>
				<input v-model="startDate" class="border rounded px-3 py-2" type="date" />

				<label class="text-sm text-gray-700">{{ __("End Date") }}</label>
				<input v-model="endDate" class="border rounded px-3 py-2" type="date" />

				<div class="flex flex-col bg-white rounded">
					<label
						v-for="employee in formData.data?.employees || []"
						:key="employee.name"
						class="flex flex-row items-center gap-3 border-b p-3"
					>
						<input v-model="selected" type="checkbox" :value="employee.name" />
						<span>
							<span class="block text-gray-900">{{ employee.employee_name }}</span>
							<span class="block text-sm text-gray-500">{{ employee.branch }} · {{ employee.default_shift || __("No shift") }}</span>
						</span>
					</label>
				</div>

				<Button variant="solid" :loading="assign.loading" @click="save">
					{{ __("Assign Shift") }} ({{ selected.length }})
				</Button>
				<p v-if="result" class="text-sm text-gray-700">
					{{ __("Created") }}: {{ result.success.length }}. {{ __("Failed") }}: {{ result.failure.length }}.
				</p>
			</div>
		</ion-content>
	</ion-page>
</template>

<script setup>
import { IonPage, IonContent } from "@ionic/vue"
import { Button, FeatherIcon, createResource, toast } from "frappe-ui"
import { inject, ref } from "vue"
import { useRouter } from "vue-router"

const __ = inject("$translate")
const router = useRouter()
const branch = ref("")
const shiftType = ref("")
const startDate = ref("")
const endDate = ref("")
const selected = ref([])
const result = ref(null)

const formData = createResource({
	url: "ebs_custom.hr_requests.api.get_shift_form_data",
	auto: true,
})

const load = () => {
	selected.value = []
	formData.submit({ branch: branch.value })
}

const assign = createResource({
	url: "ebs_custom.hr_requests.api.assign_shifts",
	onSuccess(data) {
		result.value = data
		toast({
			title: __("Shift assignment finished"),
			text: `${data.success.length} created, ${data.failure.length} failed`,
		})
	},
	onError(error) {
		toast({ title: __("Error"), text: error.messages?.[0] || __("Could not assign the shift") })
	},
})

const save = () => {
	assign.submit({
		employees: selected.value,
		shift_type: shiftType.value,
		start_date: startDate.value,
		end_date: endDate.value || null,
	})
}
</script>
