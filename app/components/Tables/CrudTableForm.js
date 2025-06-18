import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from './tableParts/Form';
import MainTableForm from './tableParts/MainTableForm';
import FloatingPanel from '../Panel/FloatingPanel';

function CrudTableForm(props) {
  const {
    title,
    dataTable,
    openForm,
    closeForm,
    removeRow,
    addNew,
    editRow,
    anchor,
    children,
    branch,
    fetchData,
    dataInit,
    formik,
    initValues
  } = props;

  useEffect(() => {
    fetchData(dataInit, branch);
  }, []);

  return (
    <div>
      <FloatingPanel openForm={openForm} branch={branch} closeForm={closeForm}>
        <Form formik={formik} initValues={initValues}>
          {children}
        </Form>
      </FloatingPanel>
      <MainTableForm
        title={title}
        addNew={addNew}
        items={dataTable}
        removeRow={removeRow}
        editRow={editRow}
        anchor={anchor}
        branch={branch}
      />
    </div>
  );
}

CrudTableForm.propTypes = {
  title: PropTypes.string.isRequired,
  anchor: PropTypes.array.isRequired,
  dataInit: PropTypes.array.isRequired,
  dataTable: PropTypes.array.isRequired,
  fetchData: PropTypes.func.isRequired,
  addNew: PropTypes.func.isRequired,
  openForm: PropTypes.bool.isRequired,
  closeForm: PropTypes.func.isRequired,
  removeRow: PropTypes.func.isRequired,
  editRow: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  branch: PropTypes.string.isRequired,
  formik: PropTypes.object.isRequired,
  initValues: PropTypes.object.isRequired,
};

export default CrudTableForm;
