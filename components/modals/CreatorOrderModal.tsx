import { useOrderVideoCreatorsMutation } from "@/store/api/global/videoCreator";
import { getToken } from "@/utils/secureStore";
import { zodResolver } from "@hookform/resolvers/zod";
import Checkbox from "expo-checkbox";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import CountryPicker, {
  Country,
  CountryCode,
} from "react-native-country-picker-modal";
import Toast from "react-native-toast-message";
import { z } from "zod";

interface Props {
  visible: boolean;
  onClose: () => void;
  name: string;
  id: string;
  private_price: string;
  bussiness_price: string;
}
const orderSchema = z.object({
  priceType: z
    .enum(["private", "business"])
    .refine((val) => val !== undefined, "Price type is required"),
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  number: z.string().min(8, "Number is required"),
  text: z.string().min(1, "Text is required"),
  terms: z.boolean().refine((val) => val === true, "You must accept terms"),
});

type OrderForm = z.infer<typeof orderSchema>;

export default function CreatorOrderModal({
  visible,
  onClose,
  name,
  private_price,
  bussiness_price,
  id,
}: Props) {
  const [countryCode, setCountryCode] = useState<CountryCode>("US");
  const [callingCode, setCallingCode] = useState("1");
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      priceType: "private",
      name: "",
      email: "",
      number: "",
      text: "",
      terms: false,
    },
  });
  const [OrderVideoCreators, { isLoading }] = useOrderVideoCreatorsMutation();
  const onSubmit = async (data: OrderForm) => {
    const token = await getToken("access_token");
    if (!token) {
      router.replace("/(drawer)/(auth)/login");
      return;
    }

    await OrderVideoCreators({
      video_creator_id: Number(id),
      order_name: data.name,
      order_email: data.email,
      phone: `+${callingCode}${data.number}`,
      whatsapp: `+${callingCode}${data.number}`,
      order_mas: data.text,
      order_type: data.priceType,
      order_artistName: name,
      private_price:
        data.priceType === "private" ? Number(private_price) : undefined,
      bussiness_price:
        data.priceType === "business" ? Number(bussiness_price) : undefined,
    })
      .unwrap()
      .then(() => {
        Toast.show({
          type: "success",
          text1: "Video Content Creator Sent Successfully",
        });
        onClose();
      })
      .catch((err: any) => {
        Toast.show({
          type: "error",
          text1: "Video Content Creator Failed",
          text2: err?.data?.message || "Something went wrong",
        });
      });
  };
  const onSelectCountry = (country: Country) => {
    setCountryCode(country.cca2 as CountryCode);
    setCallingCode(country.callingCode[0]);
  };

  const priceType = watch("priceType");

  return (
    <View className="p-4">
      <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 bg-black/40 justify-center items-center px-4">
          <View className="bg-white rounded-2xl w-full max-h-[85%] p-5">
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-lg font-bold mb-4">Select Price Type</Text>
              <View className="flex-row mb-4">
                <TouchableOpacity
                  onPress={() => setValue("priceType", "private")}
                  className={`flex-1 p-4 rounded-lg mr-2 ${
                    priceType === "private"
                      ? "bg-purple-100 border border-purple-500"
                      : "bg-gray-100"
                  }`}
                >
                  <Text className="text-center font-semibold">
                    Private Price
                  </Text>
                  <Text className="text-center text-purple-600">
                    ${private_price}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setValue("priceType", "business")}
                  className={`flex-1 p-4 rounded-lg ${
                    priceType === "business"
                      ? "bg-purple-100 border border-purple-500"
                      : "bg-gray-100"
                  }`}
                >
                  <Text className="text-center font-semibold">
                    Business Price
                  </Text>
                  <Text className="text-center text-purple-600">
                    ${bussiness_price}
                  </Text>
                </TouchableOpacity>
              </View>
              {errors.priceType && (
                <Text className="text-red-500">{errors.priceType.message}</Text>
              )}

              <Controller
                control={control}
                name="name"
                render={({ field: { value, onChange } }) => (
                  <View className="mb-4">
                    <Text className="text-gray-700 mb-1">Your Name</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3"
                      placeholder="Your Name"
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.name && (
                      <Text className="text-red-500">
                        {errors.name.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <View className="mb-4">
                    <Text className="text-gray-700 mb-1">Your Email</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3"
                      placeholder="YourMail@gmail.com"
                      value={value}
                      onChangeText={onChange}
                    />
                    {errors.email && (
                      <Text className="text-red-500">
                        {errors.email.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="number"
                render={({ field: { value, onChange } }) => (
                  <View className="mb-4">
                    <Text className="text-gray-700 mb-1">Your Number</Text>
                    <View className="flex-row items-center border border-gray-300 rounded-lg">
                      <CountryPicker
                        countryCode={countryCode}
                        withCallingCode
                        withFlag
                        withFilter
                        withAlphaFilter
                        onSelect={onSelectCountry}
                        containerButtonStyle={{ paddingHorizontal: 10 }}
                      />
                      <Text className="px-2">+{callingCode}</Text>
                      <TextInput
                        className="flex-1 p-3"
                        placeholder="1234567890"
                        value={value}
                        onChangeText={onChange}
                        keyboardType="phone-pad"
                      />
                    </View>
                    {errors.number && (
                      <Text className="text-red-500">
                        {errors.number.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="text"
                render={({ field: { value, onChange } }) => (
                  <View className="mb-4">
                    <Text className="text-gray-700 mb-1">Write your text</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3"
                      placeholder="Write your text"
                      value={value}
                      onChangeText={onChange}
                      multiline
                      numberOfLines={4}
                    />
                    {errors.text && (
                      <Text className="text-red-500">
                        {errors.text.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Controller
                control={control}
                name="terms"
                render={({ field: { value, onChange } }) => (
                  <View className="flex-row items-center mb-4">
                    <Checkbox value={value} onValueChange={onChange} />
                    <Text className="ml-2">
                      I agree to the{" "}
                      <Text className="text-blue-600 underline">Terms</Text>
                    </Text>
                  </View>
                )}
              />
              {errors.terms && (
                <Text className="text-red-500 mb-2">
                  {errors.terms.message}
                </Text>
              )}

              <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                className="bg-purple-600 py-4 rounded-full"
              >
                <Text className="text-white text-center font-semibold">
                  {isLoading ? <ActivityIndicator color="#fff" /> : " Send Now"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onClose()} className="mt-5">
                <Text className="text-center text-gray-500">Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}
