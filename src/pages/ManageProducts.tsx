import React, { useState } from "react";

import AdminProductItem from "../components/manage-products/AdminProductItem";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import AddAndEditProduct from "../components/manage-products/AddAndEditProduct";
import AlertDialog from "../components/dialogs/AlertDialog";
import { useManageProduct } from "../hooks/useManageProduct";
import { useProductsContext } from "../state/product-context";
import { Product } from "../types";
import { useDialog } from "../hooks/useDialog";

interface Props {}

const ManageProducts: React.FC<Props> = () => {
  const [openProductForm, setOpenProductForm] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const { productsState } = useProductsContext();
  const { products, loading, error } = productsState;

  const { openDialog, setOpenDialog } = useDialog();
  const {
    deleteProduct,
    loading: deleteProdLoading,
    error: deleteProdError,
  } = useManageProduct();

  if (loading) return <Spinner color="grey" width={50} height={50} />;

  return (
    <div className="page--manage-products">
      <div className="manage-products__section">
        <Button
          className="btn--orange"
          width="12rem"
          onClick={() => setOpenProductForm(true)}
        >
          Add new product
        </Button>

        {openProductForm && (
          <AddAndEditProduct
            setOpenProductForm={setOpenProductForm}
            productToEdit={productToEdit}
            setProductToEdit={setProductToEdit}
          />
        )}
      </div>

      <div className="manage-products__section">
        {!loading && products.All.length === 0 ? (
          <h2 className="header--center">No products, let's add one.</h2>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th className="table-cell">Title</th>
                <th className="table-cell">Image</th>
                <th className="table-cell">Price ($)</th>
                <th className="table-cell table-cell--hide">Created At</th>
                <th className="table-cell table-cell--hide">Updated At</th>
                <th className="table-cell">Inventory</th>
              </tr>
            </thead>

            <tbody>
              {products.All.map((product) => (
                <AdminProductItem
                  key={product.id}
                  product={product}
                  setOpenProductForm={setOpenProductForm}
                  setProductToEdit={setProductToEdit}
                  setOpenDialog={setOpenDialog}
                  setProductToDelete={setProductToDelete}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {error && <p className="paragraph paragraph--error">{error}</p>}

      {openDialog && (
        <AlertDialog
          header="Please confirm"
          message={`Are you sure you want to delete this ${
            productToDelete ? productToDelete?.title : "item"
          }?`}
          onCancel={() => {
            setProductToDelete(null);
            setOpenDialog(false);
          }}
          onConfirm={async () => {
            if (productToDelete) {
              const finished = await deleteProduct(productToDelete);

              if (finished) setOpenDialog(false);
            }
          }}
          loading={deleteProdLoading}
          error={deleteProdError}
        />
      )}
    </div>
  );
};

export default ManageProducts;
