/*
 *	@author : Veerendra Bidare
 *  Javascript file to handle basic animations, ajax, and to initialize plugins 
 */
// Document ready
$(document).ready(function(){
	$('.chosen').chosen();
	$('#orders-table').dataTable();
	$('.chosen-container').css('width','350px');
	
	$('#cat_edit').on('click',function(e){
		var cat_id = $('#cat_sel').val();
		$.ajax({
            type: "GET",
            url: 'cat_edit?cat_id='+cat_id,
            dataType: "html",
            success: function(data){
                if(data){
                	$('#single_cat_edit').remove();
                	$('#edit_cat').append(data);
                }else{
                    alert("something went wrong, please try again");
                }
            },
            error: function(){
                alert("something went wrong error, please try again");
            }
        });
	});

	$('#cat_delete').on('click',function(e){
		var cat_id = $('#cat_del').val();
		window.location.href = 'cat_delete?cat_id='+cat_id
	});

	$('#subcat_edit').on('click',function(e){
		var subcat_id = $('#subcat_sel').val();
		$.ajax({
            type: "GET",
            url: 'subcat_edit?subcat_id='+subcat_id,
            dataType: "html",
            success: function(data){
                if(data){
                	$('#single_subcat_edit').remove();
                	$('#edit_sub_cat').append(data);
                	$('.chosen').chosen();
                }else{
                    alert("something went wrong, please try again");
                }
            },
            error: function(){
                alert("something went wrong error, please try again");
            }
        });
	});

	$('#subcat_delete').on('click',function(e){
		var subcat_id = $('#subcat_del').val();
		window.location.href = 'subcat_delete?subcat_id='+subcat_id
	});

	$('body').on('change','.product_cat',function(e) {
		$.ajax({
            type: "GET",
            url: 'get_subcategory?cat_id='+$(this).val(),
            dataType: "html",
            success: function(data){
                if(data){
                	$('#product_subcat').html(data).trigger("chosen:updated");
                }else{
                    alert("something went wrong, please try again");
                }
            },
            error: function(){
                alert("something went wrong error, please try again");
            }
        });
	});

	$('#edit_prod').on('click',function(e){
		var prod_id = $('#products_edit').val();
		$.ajax({
            type: "GET",
            url: 'prod_edit?prod_id='+prod_id,
            dataType: "html",
            success: function(data){
                if(data){
                	$('#single_prod_edit').remove();
                	$('#edit_product').append(data);
                	$('.chosen').chosen();
                }else{
                    alert("something went wrong, please try again");
                }
            },
            error: function(){
                alert("something went wrong error, please try again");
            }
        });
	});

	$('#del_prod').on('click',function(e){
		var prod_id = $('#products_delete').val();
		window.location.href = 'products_delete?prod_id='+prod_id
	});
});