import React from "react";
import { useForm } from "react-hook-form";

import Input from "../Input";
import Button from "../Button";
import { Address, UserInfo } from "../../types";
import { useManageShippingAddress } from "../../hooks/useManageShippingAddress";

interface Props {
  userInfo: UserInfo | null;
  addressToEdit: Address | null;
  setAddressToEdit: (address: Address | null) => void;
}

const AddAndEditAddress: React.FC<Props> = ({
  userInfo,
  addressToEdit,
  setAddressToEdit,
}) => {
  const { register, formState, handleSubmit, reset } = useForm<Omit<Address, "index">>();
  const { errors } = formState;
  const { addNewAddress, editAddress, loading, error } = useManageShippingAddress();

  const handleAddNewAddress = handleSubmit(async (data) => {
    if (!userInfo) return;

    const finished = await addNewAddress(data, userInfo);

    if (finished) reset();
  });

  const handleEditAddress = handleSubmit(async (data) => {
    if (!userInfo?.shippingAddresses || addressToEdit?.index === undefined) return;

    if (typeof addressToEdit.index !== "number") return;

    // Check if no changes have been made
    const { fullname, address1, address2, city, zipCode, phone } = addressToEdit;

    if (
      fullname === data.fullname &&
      address1 === data.address1 &&
      address2 === data.address2 &&
      city === data.city &&
      zipCode === data.zipCode &&
      phone === data.phone
    ) {
      alert("No changes have been made.");
      return;
    }

    const finished = await editAddress(data, addressToEdit.index, userInfo);

    if (finished) {
      reset();
      setAddressToEdit(null);
    }
  });

  return (
    <form
      className="form"
      onSubmit={addressToEdit ? handleEditAddress : handleAddNewAddress}
      style={{ width: "100%" }}
    >
      <p
        className="paragraph paragraph--success paragraph--focus"
        style={{ cursor: "pointer", textAlign: "end", marginRight: "0.5rem" }}
        onClick={() => {
          reset();
          setAddressToEdit(null);
        }}
      >
        Clear all
      </p>
      <Input
        label="Fullname"
        placeholder="Your full name"
        defaultValue={addressToEdit ? addressToEdit.fullname : ""}
        {...register("fullname", { required: "Full name is required." })}
        error={errors.fullname?.message}
      />
      <Input
        label="Address1"
        placeholder="Street address, P.O. box, company name"
        defaultValue={addressToEdit ? addressToEdit.address1 : ""}
        {...register("address1", {
          required: "Street address, P.O. box, company name are required.",
        })}
        error={errors.address1?.message}
      />
      <Input
        label="Address2"
        name="address2"
        placeholder="Apartment, suite, building, floor, etc."
        defaultValue={addressToEdit ? addressToEdit.address2 : ""}
        {...register}
      />
      <Input
        label="City"
        placeholder="City"
        defaultValue={addressToEdit ? addressToEdit.city : ""}
        {...register("city", {
          required: "City is required.",
        })}
        error={errors.city?.message}
      />
      <Input
        label="Zipcode"
        placeholder="Zip code"
        defaultValue={addressToEdit ? addressToEdit.zipCode : ""}
        {...register("zipCode", {
          required: "Zip code is required.",
        })}
        error={errors.zipCode?.message}
      />
      <Input
        label="Phone"
        placeholder="Your phone number"
        defaultValue={addressToEdit ? addressToEdit.phone : ""}
        {...register("phone", {
          required: "Phone is required.",
        })}
        error={errors.phone?.message}
      />

      <Button width="100%" loading={loading} disabled={loading}>
        Submit
      </Button>

      {error && <p className="paragraph paragraph--error">{error}</p>}
    </form>
  );
};

export default AddAndEditAddress;
